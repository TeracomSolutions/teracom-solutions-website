// Maximum number of messages to send to the assistant
export const MAX_MESSAGES = 24;

// Maximum characters per message content
export const MAX_CHARS = 8000;

/**
 * Build conversation history for the assistant
 * @param {Array<{role: string, content: string}>} history - Previous messages from chat window
 * @param {string} message - New user message to append
 * @returns {Array<{role: string, content: string}>} Filtered and truncated conversation
 */
export function buildMessages(history, message) {
  // Ensure history is an array
  if (!Array.isArray(history)) {
    history = [];
  }

  // Keep only entries with valid roles and non-empty content
  let filtered = history.filter(entry =>
    (entry?.role === 'user' || entry?.role === 'assistant') &&
    typeof entry?.content === 'string' &&
    entry.content.trim() !== ''
  ).map(entry => ({
    role: entry.role,
    content: entry.content.substring(0, MAX_CHARS)
  }));

  // Drop leading assistant entries until the list starts with a user entry (or is empty)
  while (filtered.length > 0 && filtered[0].role === 'assistant') {
    filtered.shift();
  }

  // Add the new message as a user entry at the end
  const trimmedMessage = message.trim().substring(0, MAX_CHARS);
  filtered.push({ role: 'user', content: trimmedMessage });

  // Keep only the last MAX_MESSAGES entries, making sure it still starts with a user entry
  if (filtered.length > MAX_MESSAGES) {
    filtered = filtered.slice(-MAX_MESSAGES);
    // Ensure we still start with a user entry
    while (filtered.length > 0 && filtered[0].role === 'assistant') {
      filtered.shift();
    }
  }

  return filtered;
}

/**
 * Create server-sent-event frame for completion
 * @param {string} reply - The assistant's reply
 * @param {string|null} conversationId - ID of the conversation
 * @returns {string} Formatted server-sent event
 */
export function doneFrame(reply, conversationId) {
  const data = {
    type: 'done',
    reply: reply || '',
    sources: [],
    answered: true,
    conversation_id: conversationId || null,
    message_id: null
  };
  return 'data: ' + JSON.stringify(data) + String.fromCharCode(10) + String.fromCharCode(10);
}

/**
 * Create server-sent-event frame for error
 * @param {string} text - Error message
 * @returns {string} Formatted server-sent event
 */
export function errorFrame(text) {
  const data = {
    type: 'error',
    error: text || 'Tera is not available right now.'
  };
  return 'data: ' + JSON.stringify(data) + String.fromCharCode(10) + String.fromCharCode(10);
}