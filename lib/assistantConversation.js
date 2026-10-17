// The Assistant page's "Hold a conversation" mode (components/AdminAssistantChat.js),
// Robert 2026-10-06: it listens, sends what was said when the speaker
// pauses, speaks the reply, then listens again. It ends only when the person
// presses End conversation or Stop (Robert, 2026-10-17): silence, thanks and
// goodbye never end it, however long the pause.

// The pause after a reply is spoken before the microphone opens again.
export const LISTEN_DELAY_MS = 600;

// What to do when a listening round ends. heard is whether any words were
// recognised; the result is { action: 'send' | 'listen' }.
export function conversationStep({ heard }) {
  return { action: heard ? 'send' : 'listen' };
}

const NOTICES = {
  mic: 'Conversation ended: the microphone stopped. Check this site is allowed to use it.',
  stopped: 'Conversation ended.',
};

export function conversationNotice(reason) {
  return NOTICES[reason] || NOTICES.stopped;
}
