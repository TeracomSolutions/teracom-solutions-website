// Reads the help text out of the console pages -- the <AdminHelpIcon>
// blocks behind each page's ? button -- and writes lib/adminHelp.generated.js,
// so the console assistant can answer questions about every setting from the
// same words staff read (Robert, 2026-10-06). Run it with: npm run help:build.
// It also runs before every build, and lib/__tests__/adminHelp.test.js fails
// when the committed file is out of date.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const NL = String.fromCharCode(10);
const SPACES = [NL, String.fromCharCode(13), String.fromCharCode(9)];
const OPEN = '<AdminHelpIcon>';
const CLOSE = '</AdminHelpIcon>';
const SEARCH_DIRS = ['app/admin', 'components'];
export const OUTPUT = 'lib/adminHelp.generated.js';

// Pages whose heading is not plain text, or is only "Store", get a name here.
const TITLES = {
  'app/admin/brands/page.js': 'Store: Brands',
  'app/admin/catalog/page.js': 'Store: Catalog',
  'app/admin/pricing/page.js': 'Store: Pricing',
  'app/admin/freight/page.js': 'Store: Freight',
  'app/admin/seo/page.js': 'Search',
  'app/admin/seo/opportunities/page.js': 'Search: Opportunities',
  'app/admin/seo/titles/page.js': 'Search: Titles',
  'app/admin/seo/indexing/page.js': 'Search: Indexing',
  'app/admin/seo/health/page.js': 'Search: Health',
  'app/admin/seo/redirects/page.js': 'Search: Redirects',
  'app/admin/suppliers/[supplierId]/page.js': 'Data Feeds: one supplier',
  'app/admin/resources/[sourceId]/page.js': 'Resources: one watched website',
};
// Help that sits in a component rather than a page file.
const PAGES = { 'components/AdminScoutTabs.js': '/admin/scout' };

const ENTITIES = [
  ['&apos;', "'"],
  ['&quot;', '"'],
  ['&lt;', '<'],
  ['&gt;', '>'],
  ['&nbsp;', ' '],
  ['&larr;', '←'],
  ['&rarr;', '→'],
  ['&mdash;', '—'],
  ['&ndash;', '–'],
  ['&hellip;', '…'],
  ['&ldquo;', '“'],
  ['&rdquo;', '”'],
  ['&lsquo;', '‘'],
  ['&rsquo;', '’'],
  ['&times;', '×'],
  ['&middot;', '·'],
  ['&amp;', '&'],
];

const HEADINGS = new Set(['h2', 'h3', 'h4']);
const BLOCKS = new Set(['p', 'ul', 'ol', 'br', 'div', 'table', 'tr']);

// Words a tag adds: a heading starts a "### " line, a list item a "- "
// line, a paragraph its own line.
function tagText(raw) {
  let name = raw.trim().split(' ')[0].split(NL)[0].toLowerCase();
  const closing = name.startsWith('/');
  name = name.split('/').join('');
  if (HEADINGS.has(name)) return closing ? NL : NL + '### ';
  if (name === 'li') return closing ? '' : NL + '- ';
  if (BLOCKS.has(name)) return NL;
  if (name === 'td' || name === 'th') return ' ';
  return '';
}

// The index of the } that closes the { at start, counting nested braces.
function expressionEnd(jsx, start) {
  let depth = 0;
  for (let i = start; i < jsx.length; i += 1) {
    if (jsx[i] === '{') depth += 1;
    else if (jsx[i] === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return jsx.length - 1;
}

// A {' '} is a space and a {'text'} is its text; any other expression is
// code and has no words to read.
function expressionText(inner) {
  const text = inner.trim();
  const quote = text[0];
  if (text.length >= 2 && (quote === "'" || quote === '"') && text[text.length - 1] === quote) {
    return text.slice(1, -1);
  }
  return '';
}

function tidy(text) {
  const lines = text
    .split(NL)
    .map((line) => line.split(' ').filter(Boolean).join(' '))
    .filter(Boolean);
  let result = lines.join(NL);
  for (const [entity, character] of ENTITIES) result = result.split(entity).join(character);
  return result;
}

// The words of a piece of JSX, as lines of plain text with the headings
// marked "### " and list items "- ".
export function jsxToText(jsx) {
  let out = '';
  let i = 0;
  while (i < jsx.length) {
    const ch = jsx[i];
    if (ch === '<') {
      const end = jsx.indexOf('>', i);
      if (end === -1) break;
      out += tagText(jsx.slice(i + 1, end));
      i = end + 1;
    } else if (ch === '{') {
      const end = expressionEnd(jsx, i);
      out += expressionText(jsx.slice(i + 1, end));
      i = end + 1;
    } else {
      out += SPACES.includes(ch) ? ' ' : ch;
      i += 1;
    }
  }
  return tidy(out);
}

function walk(dir, found) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, found);
    else if (entry.name.endsWith('.js')) found.push(full);
  }
}

function slug(text) {
  return text
    .toLowerCase()
    .split(' ')
    .join('-')
    .split(':')
    .join('')
    .split('/')
    .join('-');
}

// The page's own name: the heading just above the help icon.
function titleFor(rel, source, at) {
  if (TITLES[rel]) return TITLES[rel];
  const heading = source.lastIndexOf('<h1', at);
  if (heading !== -1) {
    const start = source.indexOf('>', heading) + 1;
    const title = jsxToText(source.slice(start, at)).split(NL).join(' ');
    if (title) return title;
  }
  const parts = rel.split('/').filter((part) => part !== 'page.js');
  return parts[parts.length - 1];
}

function pageFor(rel) {
  if (PAGES[rel]) return PAGES[rel];
  return rel.slice('app'.length, -'/page.js'.length);
}

export function buildAdminHelp(root) {
  const files = [];
  for (const dir of SEARCH_DIRS) walk(path.join(root, dir), files);
  const relative = files.map((file) => path.relative(root, file).split(path.sep).join('/')).sort();
  const items = [];
  const used = new Set();
  for (const rel of relative) {
    const source = fs.readFileSync(path.join(root, rel), 'utf8');
    for (let at = source.indexOf(OPEN); at !== -1; at = source.indexOf(OPEN, at + 1)) {
      const end = source.indexOf(CLOSE, at);
      if (end === -1) break;
      const title = titleFor(rel, source, at);
      let id = slug(title);
      while (used.has(id)) id += '-2';
      used.add(id);
      items.push({ id, page: pageFor(rel), title, text: jsxToText(source.slice(at + OPEN.length, end)) });
    }
  }
  return items;
}

export function render(items) {
  return (
    '// Generated by scripts/build-admin-help.mjs from the help behind each console page (the ? icon). Do not edit; run npm run help:build.' +
    NL +
    'export const ADMIN_HELP = ' +
    JSON.stringify(items, null, 2) +
    ';' +
    NL
  );
}

const here = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === here) {
  const root = path.resolve(path.dirname(here), '..');
  const items = buildAdminHelp(root);
  if (items.length === 0) throw new Error('No console help found to build.');
  fs.writeFileSync(path.join(root, OUTPUT), render(items));
  console.log('Admin help: ' + items.length + ' pages written to ' + OUTPUT);
}
