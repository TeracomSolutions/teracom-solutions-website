// Hot specials and clearance (Robert, 2026-11-02). The backend works out the
// special price (services/store_promos.py) and sends it as the product's price,
// with the price it replaces; these helpers only sort and word it. Pure, with
// relative imports, so the plain Node test runner can load this file.

export const PROMO_KINDS = [
  { kind: 'special', title: 'Hot specials', eyebrow: 'This week', blurb: 'Sharp prices on selected stock, for a limited time.' },
  { kind: 'clearance', title: 'Clearance', eyebrow: 'While stocks last', blurb: 'End-of-line and surplus stock at clearance prices. When it is gone, it is gone.' },
];

export function hasPromo(product) {
  return Boolean(product && product.promo && product.promo.wasPriceCents > (product.priceCents || 0));
}

export function savingCents(product) {
  return hasPromo(product) ? product.promo.wasPriceCents - product.priceCents : 0;
}

export function savingPercent(product) {
  return hasPromo(product) ? Math.round((savingCents(product) / product.promo.wasPriceCents) * 100) : 0;
}

/** Products on special, by kind, biggest saving first. */
export function specialsByKind(products = []) {
  const out = Object.fromEntries(PROMO_KINDS.map((k) => [k.kind, []]));
  for (const p of products) {
    if (hasPromo(p) && out[p.promo.kind]) out[p.promo.kind].push(p);
  }
  for (const list of Object.values(out)) list.sort((a, b) => savingPercent(b) - savingPercent(a) || a.name.localeCompare(b.name));
  return out;
}

export function countSpecials(products = []) {
  return products.filter(hasPromo).length;
}

/** "Ends Friday 7 November" style wording, or '' with no end date. */
export function promoEndsText(endsAt, now = new Date()) {
  if (!endsAt) return '';
  const ends = new Date(endsAt);
  if (Number.isNaN(ends.getTime())) return '';
  const days = (ends.getTime() - now.getTime()) / 86400000;
  if (days <= 0) return '';
  const date = ends.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Australia/Melbourne' });
  return days < 1 ? 'Ends today' : `Ends ${date}`;
}

const dollars = (cents) => '$' + (cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * A ready-to-post draft for a special on the console's Specials list
 * (Robert, 2026-11-03): title, text, link and the product photo's address.
 * null for a row without a price.
 */
export function specialPostDraft(promo, origin, now = new Date()) {
  if (!promo || !(promo.price_cents > 0)) return null;
  const clearance = promo.kind === 'clearance';
  const label = clearance ? 'Clearance' : 'Hot special';
  const was = promo.normal_price_cents > promo.price_cents ? ` (was ${dollars(promo.normal_price_cents)})` : '';
  const ends = promoEndsText(promo.ends_at, now);
  const text = [
    `${label}: ${promo.name}, now ${dollars(promo.price_cents)} inc GST${was}.`,
    ends ? `${ends}.` : clearance ? 'While stocks last.' : '',
    'Order online, or ask our team for a trade quote.',
  ].filter(Boolean).join('\n\n');
  const image = String(promo.image_url || '');
  return {
    title: `${label}: ${promo.name}`.slice(0, 200),
    text,
    link_url: `${origin}/store/product/${promo.product_id}`,
    image_url: image.startsWith('/') ? origin + image : image,
  };
}
