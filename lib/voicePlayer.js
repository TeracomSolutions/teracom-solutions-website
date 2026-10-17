// The browser side of Tera's voice (Robert, 2026-10-06), shared by Ask Tera
// and the console Assistant. A reply is spoken by the cloud voice when the
// website's voice service is switched on (an Azure neural Australian voice,
// set on the console's Connections page), and by the browser's own voice
// otherwise, or whenever the cloud voice cannot answer. A long reply is spoken
// in pieces, one after another, so none of it is cut off (Robert, 2026-10-17).
import { pickVoice, speechChunks } from './assistantVoice.js';
import { DEFAULT_VOICE_CONFIG, normaliseVoiceConfig } from './voiceConfig.js';

// Every speak or stop takes a new number, so a cloud voice still being
// fetched when someone presses stop, or asks for another reply, never plays late.
let ticket = 0;
// The cloud piece being played: { audio, url, finish }. finish() ends the wait
// for it, so stopping a reply part way through lets speakReply give up.
let playing = null;

function browserSynth() {
  return typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis : undefined;
}

export async function loadVoiceConfig() {
  try {
    const response = await fetch('/api/voice/config');
    if (!response.ok) return DEFAULT_VOICE_CONFIG;
    return normaliseVoiceConfig(await response.json());
  } catch {
    return DEFAULT_VOICE_CONFIG;
  }
}

// The website's voice settings, asked for at most once a minute and shared by
// everything on the page that speaks.
let cachedConfig = null;
let cachedAt = 0;

export async function currentVoiceConfig() {
  if (!cachedConfig || Date.now() - cachedAt > 60 * 1000) {
    cachedConfig = await loadVoiceConfig();
    cachedAt = Date.now();
  }
  return cachedConfig;
}

function releasePlayback() {
  if (playing) {
    URL.revokeObjectURL(playing.url);
    playing = null;
  }
}

export function stopSpeaking() {
  ticket += 1;
  const current = playing;
  if (current) current.audio.pause();
  releasePlayback();
  current?.finish({ status: 'stopped' });
  browserSynth()?.cancel();
}

// Something with a cancel() that stops every kind of speech, or undefined
// where the browser cannot speak at all. It lets the components keep their
// synth()?.cancel() calls while the cloud voice stops too.
export function speechControl() {
  return browserSynth() ? { cancel: stopSpeaking } : undefined;
}

export function speakInBrowser(text, config, handlers = {}) {
  const speech = browserSynth();
  if (!speech) {
    handlers.onError?.({ error: 'unsupported' });
    return;
  }
  speech.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(speech.getVoices(), config.browserVoice);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }
  utterance.rate = config.rate;
  utterance.onstart = () => handlers.onStart?.();
  utterance.onend = () => handlers.onEnd?.();
  utterance.onerror = (event) => handlers.onError?.(event);
  speech.speak(utterance);
}

// One piece in the browser's voice; resolves when it has been spoken.
function browserPiece(text, config, onStart) {
  return new Promise((resolve) => {
    speakInBrowser(text, config, {
      onStart,
      onEnd: () => resolve({ status: 'done' }),
      onError: (event) => {
        const cancelled = event?.error === 'canceled' || event?.error === 'interrupted';
        resolve({ status: cancelled ? 'stopped' : 'error', event });
      },
    });
  });
}

// One piece in the cloud voice. 'fallback' means the voice service could not
// answer (the browser's voice takes over); 'error' means the sound would not play.
async function cloudPiece(text, mine, onStart) {
  let url;
  let audio;
  try {
    const response = await fetch('/api/voice/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('The cloud voice did not answer.');
    const blob = await response.blob();
    if (mine !== ticket) return { status: 'stopped' };
    url = URL.createObjectURL(blob);
    audio = new Audio(url);
  } catch (err) {
    return { status: 'fallback', event: err };
  }
  return new Promise((resolve) => {
    playing = { audio, url, finish: resolve };
    audio.onplaying = () => onStart();
    audio.onended = () => {
      releasePlayback();
      resolve({ status: 'done' });
    };
    audio.onerror = () => {
      releasePlayback();
      resolve({ status: 'error', event: { error: 'audio' } });
    };
    audio.play().catch((err) => {
      releasePlayback();
      resolve({ status: 'fallback', event: err });
    });
  });
}

// Speaks a reply, in the voice settings given or, when there are none, the
// website's current ones. handlers: onStart (once, when the first piece begins),
// onEnd (once, after the last piece), onError (as a speech utterance gives it)
// and onFallback, called when the cloud voice could not answer and the
// browser's voice is used instead. Stopping part way calls none of them.
export async function speakReply(reply, rawConfig, handlers = {}) {
  const pieces = speechChunks(reply);
  stopSpeaking();
  const mine = ticket;
  if (pieces.length === 0) return;
  const config = normaliseVoiceConfig(rawConfig || (await currentVoiceConfig()));
  if (mine !== ticket) return;
  let cloud = config.engine === 'cloud';
  let started = false;
  const onStart = () => {
    if (started) return;
    started = true;
    handlers.onStart?.();
  };
  for (const piece of pieces) {
    let result = cloud ? await cloudPiece(piece, mine, onStart) : null;
    if (mine !== ticket) return;
    if (result && result.status === 'fallback') {
      cloud = false;
      handlers.onFallback?.(result.event);
    }
    if (!cloud) result = await browserPiece(piece, config, onStart);
    if (mine !== ticket || result.status === 'stopped') return;
    if (result.status === 'error') {
      handlers.onError?.(result.event);
      return;
    }
  }
  handlers.onEnd?.();
}
