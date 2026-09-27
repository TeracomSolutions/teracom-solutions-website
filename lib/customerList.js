// Pure helpers for the Customers tab under Social. No React, so the plain
// Node test runner can load it.
export const CONSENT_FILTERS = [
  ['', 'Everyone'],
  ['yes', 'Receives updates'],
  ['no', 'Opted out'],
  ['unknown', 'Not asked'],
];

export const LOGIN_FILTERS = [
  ['', 'Any account'],
  ['yes', 'Has a login'],
  ['no', 'Imported, no login yet'],
];

export const SORTS = [
  ['name', 'Name'],
  ['newest', 'Newest first'],
  ['company', 'Company'],
];

export const NO_TIER = 'No tier';
const TIER_ORDER = ['Silver', 'Gold', 'Platinum'];

export function customerName(c) {
  const name = [c?.first_name, c?.last_name].filter((v) => v && String(v).trim()).join(' ').trim();
  return name || c?.company || c?.email || 'Unnamed customer';
}

export function consentLabel(value) {
  if (value === true) return 'Receives updates';
  if (value === false) return 'Opted out';
  return 'Not asked';
}

export function consentTone(value) {
  if (value === true) return 'ok';
  if (value === false) return 'bad';
  return 'muted';
}

// The query string for GET /api/admin/customers: only the values that are set.
export function customerQuery({ q, consent, tier, login, sort, page, pageSize } = {}) {
  const params = new URLSearchParams();
  const text = typeof q === 'string' ? q.trim().slice(0, 200) : '';
  if (text) params.set('q', text);
  if (consent) params.set('consent', consent);
  if (tier) params.set('tier', tier);
  if (login) params.set('login', login);
  if (sort) params.set('sort', sort);
  if (page && Number(page) > 1) params.set('page', String(page));
  if (pageSize) params.set('page_size', String(pageSize));
  return params.toString();
}

export function summarySentence(counts) {
  const c = counts || {};
  const n = (v) => Number(v) || 0;
  return `${n(c.all)} customers: ${n(c.receives_updates)} receive updates, ${n(c.opted_out)} opted out, ${n(c.not_asked)} not asked.`;
}

// "Silver 75, Gold 31, Platinum 38, No tier 551": the known tiers in their
// own order, any others alphabetically, No tier last, zeros left out.
export function tierSummary(byTier) {
  const entries = Object.entries(byTier || {}).filter(([, n]) => Number(n) > 0);
  const rank = (name) => {
    if (name === NO_TIER) return [2, ''];
    const i = TIER_ORDER.indexOf(name);
    return i >= 0 ? [0, String(i)] : [1, name];
  };
  entries.sort(([a], [b]) => {
    const [ra, ka] = rank(a);
    const [rb, kb] = rank(b);
    return ra - rb || ka.localeCompare(kb);
  });
  return entries.map(([name, n]) => `${name} ${n}`).join(', ');
}

export function shownSentence(list) {
  if (!list) return '';
  const rows = (list.customers || []).length;
  if (!rows) return 'No customers match.';
  const first = ((list.page || 1) - 1) * (list.page_size || rows) + 1;
  return `Showing ${first}–${first + rows - 1} of ${list.total}`;
}
