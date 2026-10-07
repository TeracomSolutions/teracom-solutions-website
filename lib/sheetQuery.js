// What the Store Catalog and the Pricing price list ask the backend for: one
// page of products at a time, filtered and sorted there (services/store_sheet.py
// on the backend). Robert, 2026-10-07: loading all 4,600 products into one
// table made the pages crawl.

export const PAGE_SIZE = 100;

export const DEFAULT_FILTERS = {
  q: '',
  supplierId: '',
  category: '',
  // '' shows live and offline, 'live' only what is on the website, 'offline' the rest.
  live: '',
  showInactive: false,
  // Margin under 15%, or negative.
  thin: false,
  sort: 'name',
  dir: 'asc',
  page: 1,
};

// The names the backend sorts by. Every tier's price follows the cost.
const SORT_NAMES = {
  cost_cents: 'cost',
  rrp_cents: 'price',
  price_cents: 'price',
  last_imported_at: 'last_imported',
};

export function sortName(columnKey) {
  if (String(columnKey).startsWith('tier:')) return 'tier';
  return SORT_NAMES[columnKey] || columnKey;
}

// The query string for one page, or for every matching row with { all: true }
// (the export).
export function sheetQueryString(filters, { all = false } = {}) {
  const f = { ...DEFAULT_FILTERS, ...filters };
  const params = new URLSearchParams();
  const page = Math.max(1, Math.floor(Number(f.page)) || 1);
  params.set('skip', all ? '0' : String((page - 1) * PAGE_SIZE));
  params.set('limit', all ? '5000' : String(PAGE_SIZE));
  const q = String(f.q || '').trim();
  if (q) params.set('q', q);
  if (f.supplierId) params.set('supplier_id', f.supplierId);
  if (f.category) params.set('category', f.category);
  if (f.live === 'live' || f.live === 'offline') params.set('live', f.live);
  if (f.showInactive) params.set('include_inactive', 'true');
  if (f.thin) params.set('thin', 'true');
  params.set('sort', sortName(f.sort));
  params.set('direction', f.dir === 'desc' ? 'desc' : 'asc');
  return params.toString();
}

// The same as an object, for the server-side fetch.
export function sheetParams(filters, options) {
  return Object.fromEntries(new URLSearchParams(sheetQueryString(filters, options)));
}

const ALLOWED_PARAMS = ['skip', 'limit', 'q', 'supplier_id', 'category', 'live', 'include_inactive', 'thin', 'sort', 'direction'];

// Only these are passed on from the browser to the backend.
export function pickSheetParams(searchParams) {
  const picked = {};
  for (const key of ALLOWED_PARAMS) {
    const value = searchParams.get(key);
    if (value) picked[key] = value;
  }
  return picked;
}

export function pageCount(total, size = PAGE_SIZE) {
  return Math.max(1, Math.ceil((Number(total) || 0) / size));
}

export function clampPage(page, total, size = PAGE_SIZE) {
  return Math.min(Math.max(1, Math.floor(Number(page)) || 1), pageCount(total, size));
}

// "101–200 of 4,604", or "No products".
export function rangeLabel(total, page, size = PAGE_SIZE) {
  const count = Number(total) || 0;
  if (count === 0) return 'No products';
  const first = (clampPage(page, count, size) - 1) * size + 1;
  const last = Math.min(first + size - 1, count);
  return `${first.toLocaleString('en-AU')}–${last.toLocaleString('en-AU')} of ${count.toLocaleString('en-AU')}`;
}

// Clicking a heading sorts by it; clicking it again reverses the order.
export function nextSort(current, key) {
  if (current.sort === key) return { sort: key, dir: current.dir === 'asc' ? 'desc' : 'asc' };
  return { sort: key, dir: 'asc' };
}

// Ticks on a page are added or removed without touching ticks on other pages.
export function togglePage(selected, pageIds, tickAll) {
  const next = new Set(selected);
  for (const id of pageIds) {
    if (tickAll) next.add(id);
    else next.delete(id);
  }
  return next;
}

export function allTicked(selected, ids) {
  return ids.length > 0 && ids.every((id) => selected.has(id));
}