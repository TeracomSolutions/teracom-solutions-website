// The Assistant page's "Hold a conversation" mode (components/AdminAssistantChat.js),
// Robert 2026-10-06: it listens, sends what was said when the speaker
// pauses, speaks the reply, then listens again. These decide, after each
// listening round, whether to send, listen again or finish.

// How many listening rounds in a row can hear nothing before it ends, and
// the pause after a reply is spoken before the microphone opens again.
export const MAX_SILENT_ROUNDS = 3;
export const LISTEN_DELAY_MS = 600;

const END_PHRASES = new Set([
  'goodbye', 'good bye', 'bye', 'bye bye', 'that is all', 'thats all', 'thats it', 'that is it', 'stop',
  'stop listening', 'end', 'end conversation', 'stop conversation', 'finish', 'finished', 'im done',
  'i am done', 'were done', 'we are done', 'nothing else', 'no thanks', 'no thank you', 'no that is all',
  'no thats all', 'all good', 'all done', 'thanks', 'thank you', 'cheers',
]);
const FILLER_START = ['ok', 'okay', 'thanks', 'thank you', 'cheers', 'alright', 'right', 'great', 'perfect', 'yes', 'yeah', 'so'];
const FILLER_END = ['thanks', 'thank you', 'mate', 'please', 'now', 'cheers', 'for your help'];

// Lower case words only: no apostrophes, no punctuation.
export function normaliseSpeech(text) {
  return String(text || '')
    .toLowerCase()
    .split("'")
    .join('')
    .split(String.fromCharCode(8217))
    .join('')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .join(' ');
}

// True when what was said is a goodbye ("that's all, thanks"), and only
// then: a question that happens to contain "stop" is not.
export function endsConversation(text) {
  let words = normaliseSpeech(text);
  for (let round = 0; round < 4; round += 1) {
    if (END_PHRASES.has(words)) return true;
    const before = words;
    for (const filler of FILLER_START) {
      if (words.startsWith(filler + ' ')) words = words.slice(filler.length + 1);
    }
    for (const filler of FILLER_END) {
      if (words.endsWith(' ' + filler)) words = words.slice(0, -(filler.length + 1));
    }
    if (words === before) break;
  }
  return END_PHRASES.has(words);
}

// What to do when a listening round ends. heard is whether any words were
// recognised; the result is { action: 'send' | 'listen' | 'end', silentRounds, reason }.
export function conversationStep({ heard, spoken, silentRounds }) {
  if (!heard) {
    const rounds = silentRounds + 1;
    if (rounds >= MAX_SILENT_ROUNDS) return { action: 'end', silentRounds: rounds, reason: 'silence' };
    return { action: 'listen', silentRounds: rounds, reason: '' };
  }
  if (endsConversation(spoken)) return { action: 'end', silentRounds: 0, reason: 'goodbye' };
  return { action: 'send', silentRounds: 0, reason: '' };
}

const NOTICES = {
  goodbye: 'Conversation ended.',
  silence: 'Conversation ended because nothing was heard for a while.',
  mic: 'Conversation ended: the microphone stopped. Check this site is allowed to use it.',
  error: 'Conversation ended because the assistant did not answer.',
  speech: 'Conversation ended because the reply could not be spoken.',
  stopped: 'Conversation ended.',
};

export function conversationNotice(reason) {
  return NOTICES[reason] || NOTICES.stopped;
}