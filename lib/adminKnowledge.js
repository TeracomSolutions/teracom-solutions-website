// Server-only. What the console assistant is told about each question: the
// guide and page help passages that answer it (Robert, 2026-10-06). They go
// with the message to the backend, so the answer to a question about a
// setting is already in front of the assistant instead of depending on it
// deciding to look. The build step (scripts/build-admin-help.mjs) keeps
// adminHelp.generated.js in step with the help behind each page's ? icon.
import { GUIDE_SECTIONS } from './adminGuide/index.js';
import { ADMIN_HELP } from './adminHelp.generated.js';
import { buildIndex, guidePassages, helpPassages, search, tokens } from './adminHelpSearch.js';

const MAX_TOTAL_CHARS = 12000;
const MAX_TITLE_CHARS = 200;

let cachedIndex = null;

export function knowledgeIndex() {
  if (!cachedIndex) cachedIndex = buildIndex([...helpPassages(ADMIN_HELP), ...guidePassages(GUIDE_SECTIONS)]);
  return cachedIndex;
}

// The text to search on: the latest question, with the one before it added
// when the latest is too short to search on ("and the second one?").
export function questionText(messages) {
  const asked = messages.filter((message) => message.role === 'user').map((message) => String(message.content || ''));
  const last = asked[asked.length - 1] || '';
  if (asked.length < 2 || tokens(last).length >= 3) return last;
  return asked[asked.length - 2] + ' ' + last;
}

// Up to limit passages for the conversation so far, kept within a total size.
export function knowledgeFor(messages, limit = 6) {
  const found = search(knowledgeIndex(), questionText(messages), limit);
  const passages = [];
  let used = 0;
  for (const passage of found) {
    if (used + passage.text.length > MAX_TOTAL_CHARS) continue;
    used += passage.text.length;
    passages.push({ title: passage.title.slice(0, MAX_TITLE_CHARS), text: passage.text });
  }
  return passages;
}