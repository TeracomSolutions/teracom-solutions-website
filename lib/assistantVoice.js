// The pure parts of the assistant's voice features: which browser voice to
// use, the little avatar's state machine, and what of a reply is worth
// reading aloud. Everything that touches window.* stays in the component.

// How well a browser voice suits: Australian English first, then New Zealand,
// British, Irish and any other English, with a bonus for the natural-sounding
// kinds (Edge's Natural voices, macOS Premium and Enhanced) so Natasha beats
// Catherine (Robert, 2026-10-06).
const LANGUAGE_SCORES = [['en-AU', 100], ['en-NZ', 60], ['en-GB', 50], ['en-IE', 40], ['en', 30]];

function voiceScore(voice) {
  const language = String(voice.lang || '').split('_').join('-');
  const found = LANGUAGE_SCORES.find(([prefix]) => language.startsWith(prefix));
  const natural = /natural|neural|online|premium|enhanced/i.test(String(voice.name || ''));
  return (found ? found[1] : 0) + (natural ? 20 : 0);
}

// The voice to speak with: one whose name contains the preferred text when
// the browser has it, else the best English voice, else the browser default.
export function pickVoice(voices, preferred = '') {
  if (!Array.isArray(voices) || voices.length === 0) return undefined;
  const wanted = String(preferred || '').trim().toLowerCase();
  if (wanted) {
    const match = voices.find((voice) => String(voice.name || '').toLowerCase().includes(wanted));
    if (match) return match;
  }
  let best;
  let bestScore = -1;
  for (const voice of voices) {
    const score = voiceScore(voice);
    if (score > bestScore) {
      best = voice;
      bestScore = score;
    }
  }
  if (bestScore >= 30) return best;
  return voices.find((voice) => voice.default) || voices[0];
}

// States: idle | listening | thinking | speaking.
// Events: listen_start, listen_end, send, reply ({ type: 'reply', speak }),
// speak_end, error. Anything else leaves the state alone.
export function nextState(current, event) {
  const type = typeof event === 'string' ? event : event?.type;
  switch (type) {
    case 'listen_start':
      return 'listening';
    case 'listen_end':
    case 'speak_end':
    case 'error':
      return 'idle';
    case 'send':
      return 'thinking';
    case 'reply':
      return typeof event === 'object' && event.speak ? 'speaking' : 'idle';
    default:
      return current;
  }
}

const MAX_SPOKEN = 1200;

export function speakableText(reply) {
  const text = String(reply || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^\s*#{1,6}\s+/gm, '')
    .replace(/^\s*[-*•]\s+/gm, '')
    .replace(/(\*{1,3}|_{1,3})(\S(?:.*?\S)?)\1/g, '$2')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= MAX_SPOKEN) return text;
  return `${text.slice(0, MAX_SPOKEN - 1).replace(/\s+\S*$/, '')}…`;
}
