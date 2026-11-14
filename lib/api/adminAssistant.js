// Server-only. The admin assistant -- api/staff_assistant.py on the
// website backend, staff bearer token. A turn can take a while: the model
// may call several tools before it answers.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminAssistant.js must only be used on the server.');
}

import { pageFor } from '../adminPages.js';
import { backendFetch } from './client.js';
import { GUIDE_SECTIONS } from '../adminGuide/index.js';
import { knowledgeFor } from '../adminKnowledge.js';
import { toBackendMessage } from '../attachments.js';

// The console guide (the Help text) goes with every turn, so the assistant
// answers how-to questions from the same text staff see, and reads only
// the sections it needs (its read_guide tool). The passages of the guide
// and of each page's help that answer the latest question go with it
// (knowledge), so the answer to a question about a setting is in front of
// the assistant. voice is true during a spoken conversation, which asks
// for short answers that read well aloud.
// chatId continues a saved chat; without it the backend starts a new one and returns its id.
// What the page the message was sent from is, from the console's own page list, so the Assistant knows where staff are.
function pageInfo(path) {
  const page = path ? pageFor(path) : null;
  if (!page) return null;
  return `${page.title} (menu: ${page.menu || 'not in the menu'}). ${page.what} It shows: ${page.shows} Guide section: ${page.guide || 'none'}.`.slice(0, 1500);
}

export async function assistantChat(token, messages, voice = false, chatId = null, page = null) {
  const guide = GUIDE_SECTIONS.map(({ id, title, markdown }) => ({ id, title, markdown }));
  const knowledge = knowledgeFor(messages);
  return backendFetch('/staff/assistant/chat', { method: 'POST', token, body: { page_info: pageInfo(page), messages: messages.map(toBackendMessage), guide, knowledge, voice, chat_id: chatId, page: page || undefined } });
}

// Saved chats and the Assistant's memory (Robert, 2026-10-25).
export const listAssistantChats = (token, q = '') => backendFetch(`/staff/assistant/chats${q ? `?q=${encodeURIComponent(q)}` : ''}`, { token });
export const getAssistantChat = (token, id) => backendFetch(`/staff/assistant/chats/${encodeURIComponent(id)}`, { token });
export const renameAssistantChat = (token, id, title) => backendFetch(`/staff/assistant/chats/${encodeURIComponent(id)}`, { method: 'PATCH', token, body: { title } });
export const hideAssistantChat = (token, id) => backendFetch(`/staff/assistant/chats/${encodeURIComponent(id)}`, { method: 'DELETE', token });
export const listAssistantMemory = (token) => backendFetch('/staff/assistant/memory', { token });
export const addAssistantMemory = (token, text) => backendFetch('/staff/assistant/memory', { method: 'POST', token, body: { text } });
export const removeAssistantMemory = (token, id) => backendFetch(`/staff/assistant/memory/${encodeURIComponent(id)}`, { method: 'DELETE', token });
