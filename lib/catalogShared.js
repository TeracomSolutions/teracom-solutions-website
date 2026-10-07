// What the Store Catalog sheet's components share: money shown in dollars
// (the backend keeps cents), the margin maths, the CSV export and the one
// fetch helper.

export const GST = 1.1;

const NEWLINE = String.fromCharCode(10);
const QUOTE = String.fromCharCode(34);

export const inputStyle = { padding: '4px 6px', borderRadius: '6px', border: '1px solid var(--line)', background: '#0d0d0d', color: '#fff', font: 'inherit', fontSize: '13px' };

export function money(cents) {
  if (cents == null || Number.isNaN(cents)) return '—';
  return `$${(cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function dollars(cents) {
  return cents == null ? '' : (cents / 100).toFixed(2);
}

export function marginOf(rrpCents, costCents) {
  if (rrpCents == null || costCents == null) return { cents: null, pct: null };
  const exGst = rrpCents / GST;
  const cents = exGst - costCents;
  return { cents, pct: exGst > 0 ? (cents / exGst) * 100 : null };
}

export function marginClass(pct) {
  if (pct == null) return 'admin-muted';
  if (pct < 0) return 'admin-margin bad';
  if (pct < 15) return 'admin-margin thin';
  return 'admin-margin good';
}

export async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The request failed.');
  return data;
}

export function csvEscape(value) {
  const text = value == null ? '' : String(value);
  const needsQuotes = text.includes(QUOTE) || text.includes(',') || text.includes(NEWLINE);
  return needsQuotes ? QUOTE + text.split(QUOTE).join(QUOTE + QUOTE) + QUOTE : text;
}

// Every column of the products given, with each tier's price.
export function catalogCsv(products, tiers) {
  const header = ['SKU', 'Name', 'Brand', 'Category', 'Supplier', 'Cost ex GST', 'RRP inc GST', 'RRP ex GST', 'Margin $', 'Margin %',
    ...tiers.map((t) => t.label), 'Stock', 'Active', 'Live on website', 'Last imported'];
  const lines = products.map((p) => {
    const { cents, pct } = marginOf(p.price_cents, p.cost_cents);
    const tp = p.tier_prices_cents || {};
    return [p.sku, p.name, p.brand, p.category, p.supplier, dollars(p.cost_cents), dollars(p.price_cents), (p.price_cents / GST / 100).toFixed(2),
      cents == null ? '' : (cents / 100).toFixed(2), pct == null ? '' : pct.toFixed(1),
      ...tiers.map((t) => dollars(tp[t.key])), p.stock, p.active ? 'yes' : 'no', p.published ? 'yes' : 'no', p.last_imported_at || ''].map(csvEscape).join(',');
  });
  return [header.join(','), ...lines].join(NEWLINE);
}