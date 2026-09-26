// The pure parts of the assistant's voice features: which browser voice to
// use, the little avatar's state machine, and what of a reply is worth
// reading aloud. Everything that touches window.* stays in the component.

export function pickVoice(voices) {
  if (!Array.isArray(voices) || voices.length === 0) return undefined;
  const firstWhere = (test) => voices.find((voice) => test(String(voice.lang || '')));
  return (
    firstWhere((lang) => lang.startsWith('en-AU'))
    || firstWhere((lang) => lang.startsWith('en-GB'))
    || firstWhere((lang) => lang.startsWith('en'))
    || voices.find((voice) => voice.default)
    || voices[0]
  );
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
