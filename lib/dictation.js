// Dictation into the assistant's message box (components/AdminAssistantChat.js).

// What the box shows while dictating: whatever was typed before, the words
// the browser has settled on, then the words it is still hearing.
export function joinSpeech(...parts) {
  return parts
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .join(' ');
}

// Errors after which listening stops for good. "no-speech" (a long
// silence) and "aborted" (Stop was pressed) are not among them: when the
// microphone is held open, a silence just starts a fresh session.
export function endsDictation(error) {
  return error !== 'no-speech' && error !== 'aborted';
}