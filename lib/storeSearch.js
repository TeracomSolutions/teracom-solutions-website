// Searching the store's products (Robert, 2026-10-08): a search box on the
// Store page and on every category, and a results page that narrows by
// category and brand. Pure functions with no imports, so the plain Node test
// runner and the browser (the category page filters its tiles as you type)
// can both load this file.

export const SEARCH_PAGE_SIZE = 24;

const STOPWORDS = new Set(['a', 'an', 'and', 'the', 'for', 'of', 'to', 'in', 'on', 'with', 'my', 'i']);

export function normalise(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Letters and digits only: "DS-2CD 2143" and "ds2cd2143" are the same part number.
export function squash(text) {
  return normalise(text).split(' ').join('');
}

export function queryTokens(query) {
  return normalise(query)
    .split(' ')
    .filter((token) => token && !STOPWORDS.has(token))
    .map((token) => (token.length > 3 && token.endsWith('s') ? token.slice(0, -1) : token));
}

const INDEXES = new WeakMap();

function indexOf(product) {
  let index = INDEXES.get(product);
  if (!index) {
    const name = normalise(product.name);
    index = {
      name,
      words: name.split(' ').filter(Boolean),
      brand: normalise(product.brand),
      category: normalise(product.category),
      codes: [squash(product.sku), squash(product.mpn || product.manufacturerSku)].filter(Boolean),
      description: normalise(String(product.description || '').slice(0, 800)),
    };
    INDEXES.set(product, index);
  }
  return index;
}

function hasWord(text, token) {
  return ` ${text}`.includes(` ${token}`);
}

// How well the whole query, as a part number, matches this product's codes.
function codeScore(index, whole) {
  if (whole.length < 3) return 0;
  let best = 0;
  for (const code of index.codes) {
    if (code === whole) best = Math.max(best, 100);
    else if (code.startsWith(whole)) best = Math.max(best, 70);
    else if (code.includes(whole)) best = Math.max(best, 50);
  }
  return best;
}

// How well one query word matches: the start of a word in the name counts
// most, then the brand, a part number, the category and the description.
function tokenScore(index, token) {
  let best = 0;
  if (index.words.some((word) => word.startsWith(token))) best = 30;
  else if (token.length >= 3 && index.name.includes(token)) best = 15;
  if (hasWord(index.brand, token)) best = Math.max(best, 25);
  if (hasWord(index.category, token)) best = Math.max(best, 10);
  if (token.length >= 3 && index.codes.some((code) => code.includes(token))) best = Math.max(best, 20);
  if (token.length >= 3 && hasWord(index.description, token)) best = Math.max(best, 4);
  return best;
}

// 0 when the product does not match. Every word of the query has to match
// somewhere, unless the whole query is a part number that is in the product's codes.
export function scoreProduct(product, tokens, whole, phrase = '') {
  const index = indexOf(product);
  const byCode = codeScore(index, whole);
  let sum = 0;
  let every = tokens.length > 0;
  for (const token of tokens) {
    const score = tokenScore(index, token);
    if (!score) every = false;
    sum += score;
  }
  if (!every && !byCode) return 0;
  const bonus = phrase.length >= 3 && index.name.includes(phrase) ? 20 : 0;
  return byCode + (every ? sum : 0) + bonus;
}

// Whether a tile (id, sku, mpn, name, brand) matches what has been typed.
export function tileMatches(tile, query) {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return true;
  return scoreProduct(tile, tokens, squash(query), normalise(query)) > 0;
}

function tally(map, key) {
  if (key) map.set(key, (map.get(key) || 0) + 1);
}

function counted(map) {
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'en-AU', { sensitivity: 'base' }));
}

// The products that match, best first, a page of them, and how many there are
// in each category and brand among all the matches (before those filters).
export function searchProducts(products = [], { q = '', categoryTitle = '', brand = '', page = 1, size = SEARCH_PAGE_SIZE } = {}) {
  const tokens = queryTokens(q);
  const whole = squash(q);
  const phrase = normalise(q);
  const browsing = tokens.length === 0 && whole === '';
  const scored = [];
  for (const product of products) {
    const score = browsing ? 1 : scoreProduct(product, tokens, whole, phrase);
    if (score > 0) scored.push({ product, score: score + (product.imageUrl ? 2 : 0) });
  }
  scored.sort((a, b) => b.score - a.score || String(a.product.name).localeCompare(String(b.product.name), 'en-AU', { sensitivity: 'base' }));
  const brandCounts = new Map();
  const categoryCounts = new Map();
  for (const { product } of scored) {
    tally(brandCounts, product.brand);
    tally(categoryCounts, product.category);
  }
  const filtered = scored.filter(
    ({ product }) => (!categoryTitle || product.category === categoryTitle) && (!brand || product.brand === brand)
  );
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const current = Math.min(Math.max(1, Math.floor(Number(page)) || 1), pages);
  return {
    query: q,
    total: filtered.length,
    matched: scored.length,
    page: current,
    pages,
    items: filtered.slice((current - 1) * size, current * size).map(({ product }) => product),
    brands: counted(brandCounts),
    categories: counted(categoryCounts),
  };
}

export function searchHref({ q = '', category = '', brand = '', page = 1 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  if (brand) params.set('brand', brand);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `/store/search?${query}` : '/store/search';
}

// The page numbers to show under the results: the first, the last and the
// ones around the current page, with '…' where numbers are left out.
export function pageWindow(current, pages) {
  const wanted = new Set([1, pages, current - 1, current, current + 1]);
  const numbers = [...wanted].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const out = [];
  numbers.forEach((n, i) => {
    if (i > 0 && n - numbers[i - 1] > 1) out.push('…');
    out.push(n);
  });
  return out;
}