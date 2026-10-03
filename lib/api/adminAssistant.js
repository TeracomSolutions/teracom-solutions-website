// Server-only. The admin assistant -- api/staff_assistant.py on the
// website backend, staff bearer token. A turn can take a while: the model
// may call several tools before it answers.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminAssistant.js must only be used on the server.');
}

import { backendFetch } from './client.js';
import { GUIDE_SECTIONS } from '../adminGuide/index.js';

// The console guide (the Help text) goes with every turn, so the assistant
// answers how-to questions from the same text staff see, and reads only
// the sections it needs (its read_guide tool).
export async function assistantChat(token, messages) {
  const guide = GUIDE_SECTIONS.map(({ id, title, markdown }) => ({ id, title, markdown }));
  return backendFetch('/staff/assistant/chat', { method: 'POST', token, body: { messages, guide } });
}
