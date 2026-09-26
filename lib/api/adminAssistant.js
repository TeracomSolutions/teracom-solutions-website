// Server-only. The admin assistant -- api/staff_assistant.py on the
// website backend, staff bearer token. A turn can take a while: the model
// may call several tools before it answers.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminAssistant.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function assistantChat(token, messages) {
  return backendFetch('/staff/assistant/chat', { method: 'POST', token, body: { messages } });
}
