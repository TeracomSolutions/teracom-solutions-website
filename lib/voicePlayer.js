// The browser side of Tera's voice (Robert, 2026-10-06), shared by Ask Tera
// and the console Assistant. A reply is spoken by the cloud voice when the
// website's voice service is switched on (an Azure neural Australian voice,
// set on the console's Connections page), and by the browser's own voice
// otherwise, or whenever the cloud voice cannot answer.
import { pickVoice, speakableText } from './assistantVoice.js';
import { DEFAULT_VOICE_CONFIG, normaliseVoiceConfig } from './voiceConfig.js';

// Every speak or stop takes a new number, so a cloud voice still being
// fetched when someone presses stop, or asks for another reply, never plays late.
let ticket = 0;
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
  if (playing) playing.audio.pause();
  releasePlayback();
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

// Speaks a reply, in the voice settings given or, when there are none, the
// website's current ones. handlers: onStart, onEnd, onError (as a speech
// utterance gives them) and onFallback, called when the cloud voice could not
// answer and the browser's voice is used instead.
export async function speakReply(reply, rawConfig, handlers = {}) {
  const text = speakableText(reply);
  stopSpeaking();
  const mine = ticket;
  if (!text) return;
  const config = normaliseVoiceConfig(rawConfig || (await currentVoiceConfig()));
  if (mine !== ticket) return;
  if (config.engine === 'cloud') {
    try {
      const response = await fetch('/api/voice/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('The cloud voice did not answer.');
      const blob = await response.blob();
      if (mine !== ticket) return;
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      playing = { audio, url };
      audio.onplaying = () => handlers.onStart?.();
      audio.onended = () => {
        releasePlayback();
        handlers.onEnd?.();
      };
      audio.onerror = () => {
        releasePlayback();
        handlers.onError?.({ error: 'audio' });
      };
      await audio.play();
      return;
    } catch (err) {
      releasePlayback();
      if (mine !== ticket) return;
      handlers.onFallback?.(err);
    }
  }
  speakInBrowser(text, config, handlers);
}