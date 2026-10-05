// Server-only. The admin assistant -- api/staff_assistant.py on the
// website backend, staff bearer token. A turn can take a while: the model
// may call several tools before it answers.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminAssistant.js must only be used on the server.');
}

import { backendFetch } from './client.js';
import { GUIDE_SECTIONS } from '../adminGuide/index.js';
import { knowledgeFor } from '../adminKnowledge.js';

// The console guide (the Help text) goes with every turn, so the assistant
// answers how-to questions from the same text staff see, and reads only
// the sections it needs (its read_guide tool). The passages of the guide
// and of each page's help that answer the latest question go with it
// (knowledge), so the answer to a question about a setting is in front of
// the assistant. voice is true during a spoken conversation, which asks
// for short answers that read well aloud.
export async function assistantChat(token, messages, voice = false) {
  const guide = GUIDE_SECTIONS.map(({ id, title, markdown }) => ({ id, title, markdown }));
  const knowledge = knowledgeFor(messages);
  return backendFetch('/staff/assistant/chat', { method: 'POST', token, body: { messages, guide, knowledge, voice } });
}
