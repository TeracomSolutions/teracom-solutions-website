// A small, safe reader for the Assistant's replies: paragraphs, headings, bullet and numbered lists,
// fenced code blocks, and inline bold, code and https links. It builds plain data (no HTML), which the
// chat turns into React elements, so nothing a model writes can inject markup.

const NL = String.fromCharCode(10);
const TICK = String.fromCharCode(96);
const FENCE = TICK.repeat(3);

export function parseInline(text) {
  const out = [];
  let rest = String(text || '');
  const pattern = new RegExp(`(\\*\\*[^*]+\\*\\*|${TICK}[^${TICK}]+${TICK}|\\[[^\\]]+\\]\\(https://[^)\\s]+\\))`);
  while (rest) {
    const match = pattern.exec(rest);
    if (!match) {
      out.push({ t: 'text', text: rest });
      break;
    }
    if (match.index > 0) out.push({ t: 'text', text: rest.slice(0, match.index) });
    const token = match[0];
    if (token.startsWith('**')) out.push({ t: 'bold', text: token.slice(2, -2) });
    else if (token.startsWith(TICK)) out.push({ t: 'code', text: token.slice(1, -1) });
    else {
      const split = token.indexOf('](');
      out.push({ t: 'link', text: token.slice(1, split), href: token.slice(split + 2, -1) });
    }
    rest = rest.slice(match.index + token.length);
  }
  return out;
}

export function parseBlocks(markdown) {
  const lines = String(markdown || '').split(NL);
  const blocks = [];
  let paragraph = [];
  let list = null;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'p', text: paragraph.join(' ') });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim().startsWith(FENCE)) {
      flushParagraph();
      flushList();
      const lang = line.trim().slice(3).trim();
      const body = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith(FENCE)) {
        body.push(lines[i]);
        i += 1;
      }
      blocks.push({ type: 'code', lang, text: body.join(NL) });
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h', level: heading[1].length, text: heading[2] });
      continue;
    }
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
    const numbered = /^\s*[0-9]+[.)]\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      flushParagraph();
      const kind = bullet ? 'ul' : 'ol';
      if (!list || list.type !== kind) {
        flushList();
        list = { type: kind, items: [] };
      }
      list.items.push((bullet || numbered)[1]);
      continue;
    }
    flushList();
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushList();
  return blocks;
}
