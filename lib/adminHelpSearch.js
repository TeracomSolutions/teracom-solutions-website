// Finds the console help that answers a question: the guide sections and
// the text behind each page's ? icon, cut into passages and ranked by how
// well their words match (Robert, 2026-10-06). Pure, so it is tested without
// the console.

const NL = String.fromCharCode(10);
const MAX_PASSAGE_CHARS = 2800;

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'to', 'of', 'in', 'on', 'at', 'for', 'and', 'or',
  'do', 'does', 'did', 'how', 'what', 'when', 'where', 'which', 'who', 'why', 'can', 'could', 'would', 'should',
  'will', 'i', 'it', 'its', 'my', 'me', 'we', 'you', 'your', 'this', 'that', 'these', 'those', 'with', 'from',
  'by', 'as', 'about', 'if', 'so', 'there', 'not', 'have', 'has', 'any', 'all', 'tell', 'show', 'explain',
  'please', 'need', 'want', 'get', 'use', 'let', 'know', 'mean', 'means',
]);

// A plural becomes its singular, so "settings" finds "setting".
export function stem(word) {
  if (word.length > 4 && word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss') && !word.endsWith('us') && !word.endsWith('is')) {
    return word.slice(0, -1);
  }
  return word;
}

export function tokens(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter((word) => word && !STOP_WORDS.has(word))
    .map(stem);
}

// A markdown text as [{ heading, body }], one per "#" heading line.
function splitSections(markdown) {
  const sections = [{ heading: '', lines: [] }];
  for (const line of String(markdown || '').split(NL)) {
    if (line.startsWith('#')) {
      sections.push({ heading: line.split('#').join('').trim(), lines: [] });
    } else {
      sections[sections.length - 1].lines.push(line);
    }
  }
  return sections.map(({ heading, lines }) => ({ heading, body: lines.join(NL).trim() }));
}

// Pieces of text no longer than max, cut at line ends where possible.
function chunk(text, max) {
  const pieces = [];
  let current = '';
  for (const line of text.split(NL)) {
    if (current && current.length + line.length + 1 > max) {
      pieces.push(current);
      current = '';
    }
    let rest = line;
    while (rest.length > max) {
      pieces.push(rest.slice(0, max));
      rest = rest.slice(max);
    }
    current = current ? current + NL + rest : rest;
  }
  if (current) pieces.push(current);
  return pieces;
}

// The passages of one markdown text: one per heading, split again when long.
export function passagesFrom(source, title, markdown) {
  const out = [];
  for (const { heading, body } of splitSections(markdown)) {
    if (!body) continue;
    const label = heading ? title + ': ' + heading : title;
    const pieces = chunk(body, MAX_PASSAGE_CHARS);
    pieces.forEach((piece, n) => {
      out.push({ source, title: pieces.length > 1 ? label + ' (part ' + (n + 1) + ')' : label, text: piece });
    });
  }
  return out;
}

export function guidePassages(sections) {
  return sections.flatMap((section) => passagesFrom('guide:' + section.id, section.title, section.markdown));
}

export function helpPassages(items) {
  return items.flatMap((item) => passagesFrom('help:' + item.id, item.title + ' page help', item.text));
}

export function buildIndex(passages) {
  const docs = passages.map((passage) => {
    const counts = new Map();
    const words = tokens(passage.text);
    for (const term of words) counts.set(term, (counts.get(term) || 0) + 1);
    return { passage, counts, titleTerms: new Set(tokens(passage.title)), phrases: ' ' + words.join(' ') + ' ' };
  });
  const df = new Map();
  for (const doc of docs) {
    for (const term of new Set([...doc.counts.keys(), ...doc.titleTerms])) df.set(term, (df.get(term) || 0) + 1);
  }
  return { docs, df, size: docs.length };
}

// The best passages for a question, best first. A word counts for more when
// few passages use it and when it is in the passage's title; a passage that
// matches more of the question's words beats one that matches fewer, and
// two of the question's words side by side in the passage ("minimum
// charge") count extra.
export function search(index, query, limit = 6) {
  const words = tokens(query);
  const terms = [...new Set(words)];
  if (terms.length === 0) return [];
  const idfOf = (term) => Math.log(1 + index.size / (1 + (index.df.get(term) || 0)));
  const scored = [];
  index.docs.forEach((doc, order) => {
    let score = 0;
    let matched = 0;
    for (const term of terms) {
      const count = doc.counts.get(term) || 0;
      const inTitle = doc.titleTerms.has(term);
      if (!count && !inTitle) continue;
      matched += 1;
      score += idfOf(term) * (1 + Math.log(1 + count) + (inTitle ? 1.5 : 0));
    }
    if (matched === 0) return;
    for (let n = 0; n + 1 < words.length; n += 1) {
      if (doc.phrases.includes(' ' + words[n] + ' ' + words[n + 1] + ' ')) {
        score += 1.5 * Math.min(idfOf(words[n]), idfOf(words[n + 1]));
      }
    }
    scored.push({ doc, order, score: score * (0.5 + matched / terms.length) });
  });
  scored.sort((a, b) => b.score - a.score || a.order - b.order);
  if (scored.length === 0) return [];
  const floor = scored[0].score * 0.35;
  return scored
    .filter((entry) => entry.score >= floor)
    .slice(0, limit)
    .map((entry) => entry.doc.passage);
}