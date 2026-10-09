// Old addresses that now go to a page on the new site (Robert, 2026-10-09).
// Google still shows people the old Zoho shop's addresses; the backend keeps
// the list of where each belongs (Search on the console), and the middleware
// asks for it every few minutes and sends anyone who arrives at an old
// address to its new page with a permanent redirect. Pure: the only outside
// call is the one handed in.

export const REFRESH_MS = 5 * 60 * 1000;
export const RETRY_MS = 30 * 1000;
export const TIMEOUT_MS = 1500;
const MAX_HOPS = 3;
const CONSOLE_PREFIXES = ['/admin', '/api/admin', '/api/tera'];

// What two addresses are compared by: lower case, no trailing slash, no
// query or anchor. The backend keeps its list the same way (seo_match.key_of).
export function redirectKey(pathname) {
  let text = String(pathname || '');
  try {
    text = decodeURIComponent(text);
  } catch {
    // keep the address as it came
  }
  text = text.trim().toLowerCase().split('?')[0].split('#')[0];
  if (!text.startsWith('/')) text = `/${text}`;
  while (text.length > 1 && text.endsWith('/')) text = text.slice(0, -1);
  return text;
}

// The console and its calls are never redirected.
export function isConsolePath(pathname) {
  return CONSOLE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

// A page on this site, and nothing else: it starts with one slash, has no
// spaces or control characters, and none of < > quote marks or backslash.
export function isSafeTarget(target) {
  const text = String(target || '');
  if (!text.startsWith('/') || text.startsWith('//') || text.length > 300) return false;
  const banned = [34, 39, 60, 62, 92];
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code <= 32 || banned.includes(code)) return false;
  }
  return true;
}

// The list the backend sends, [[old address, new address], ...], as a Map from
// the old address's key to the new address. Pairs that are not safe, that
// point at themselves or that start at the home page are left out.
export function buildTable(pairs) {
  const table = new Map();
  for (const pair of Array.isArray(pairs) ? pairs : []) {
    if (!Array.isArray(pair) || pair.length < 2) continue;
    const key = redirectKey(pair[0]);
    if (key === '/' || !isSafeTarget(pair[1]) || redirectKey(pair[1]) === key) continue;
    table.set(key, pair[1]);
  }
  return table;
}

// Where an address should go, or null. A new address that is itself listed
// is followed on (up to three steps); a loop gives null.
export function lookup(table, pathname) {
  let key = redirectKey(pathname);
  const seen = new Set([key]);
  let target = null;
  for (let hop = 0; hop < MAX_HOPS; hop += 1) {
    const next = table.get(key);
    if (!next) break;
    target = next;
    key = redirectKey(next);
    if (seen.has(key)) return null;
    seen.add(key);
  }
  return target;
}

// The latest list, kept in memory. load() fetches the pairs; it is called when
// the list is older than REFRESH_MS, one call at a time, and when it fails the
// last good list is kept and the next try is RETRY_MS away.
export function createRedirectCache({ load, now = () => Date.now() }) {
  let table = new Map();
  let nextTry = 0;
  let pending = null;

  async function refresh() {
    try {
      table = buildTable(await load());
      nextTry = now() + REFRESH_MS;
    } catch {
      nextTry = now() + RETRY_MS;
    }
  }

  return async function current() {
    if (now() >= nextTry) {
      if (!pending) pending = refresh().finally(() => { pending = null; });
      await pending;
    }
    return table;
  };
}