// The pure parts of the cost bands on the Pricing page (Robert, 2026-10-09).
// A band is a range of what we pay for a product (cost ex GST) with its own
// markup for each customer tier, so cheap items can carry a bigger markup
// than dear ones. Bands are kept per supplier, with a default set for every
// supplier. The editor keeps the bands that stop at a cost limit as rows, and
// the band for every higher cost as one more set of markups, rest. The
// backend keeps them (api/pricing.py) and prices every product from them.

export const MAX_BANDS = 12;
export const MAX_MARKUP = 1000;
export const DEFAULT_SCOPE = 'default';

// The key for a set of bands: a supplier's id, or "default" for every supplier.
export function scopeOf(supplierId) {
  return supplierId ? String(supplierId) : DEFAULT_SCOPE;
}

// The supplier id to send the backend for a key, null for the default bands.
export function supplierOfScope(scope) {
  return scope === DEFAULT_SCOPE ? null : scope;
}

// The bands in one set, from the sets the backend sends.
export function bandsForScope(sets, scope) {
  const found = (Array.isArray(sets) ? sets : []).find((set) => scopeOf(set.supplier_id) === scope);
  return found ? found.bands : [];
}

// The keys of the sets that have any bands.
export function scopesWithBands(sets) {
  return new Set((Array.isArray(sets) ? sets : []).filter((set) => set.bands.length > 0).map((set) => scopeOf(set.supplier_id)));
}

// "$1,000" or "$99.50" for a number of dollars.
export function dollarText(dollars) {
  const hasCents = Math.round(dollars * 100) % 100 !== 0;
  return `$${dollars.toLocaleString('en-AU', { minimumFractionDigits: hasCents ? 2 : 0, maximumFractionDigits: 2 })}`;
}

// What staff typed as a cost limit, in cents, or null when it is not a usable amount.
export function dollarsToCents(text) {
  const raw = String(text ?? '').trim().replaceAll('$', '').replaceAll(',', '');
  if (raw === '') return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0 || value > 1000000) return null;
  return Math.round(value * 100);
}

// A number of cents as the text for a box: 10000 gives 100.
export function centsToText(cents) {
  return String(Number((cents / 100).toFixed(2)));
}

export function emptyMarkups(tiers) {
  return Object.fromEntries(tiers.map((tier) => [tier.key, '']));
}

function markupTexts(markups, tiers) {
  const texts = emptyMarkups(tiers);
  for (const tier of tiers) {
    const value = markups ? markups[tier.key] : undefined;
    if (value !== undefined && value !== null) texts[tier.key] = String(value);
  }
  return texts;
}

// The editor's state from the bands the backend sends: { rows, rest }.
export function editorFromBands(bands, tiers) {
  const list = Array.isArray(bands) ? bands : [];
  const rows = list
    .filter((band) => band.up_to_cents !== null && band.up_to_cents !== undefined)
    .sort((a, b) => a.up_to_cents - b.up_to_cents)
    .map((band) => ({ limit: centsToText(band.up_to_cents), markups: markupTexts(band.markups, tiers) }));
  const open = list.find((band) => band.up_to_cents === null || band.up_to_cents === undefined);
  return { rows, rest: markupTexts(open ? open.markups : null, tiers) };
}

function filled(markups) {
  return Object.values(markups).some((text) => String(text).trim() !== '');
}

// One markup box as a number, null when blank, NaN when it is not usable.
function markupNumber(text) {
  const raw = String(text ?? '').trim();
  if (raw === '') return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0 || value > MAX_MARKUP) return Number.NaN;
  return Math.round(value * 100) / 100;
}

function markupsFrom(markups, tiers) {
  const out = {};
  for (const tier of tiers) {
    const value = markupNumber(markups[tier.key]);
    if (Number.isNaN(value)) return { error: `A ${tier.label} markup has to be a number from 0 to ${MAX_MARKUP}, or left blank.` };
    if (value !== null) out[tier.key] = value;
  }
  return { markups: out };
}

// What to send the backend: { bands: [{ up_to_cents, markups }] }, or { error }.
// A row with nothing in it is ignored.
export function bandsFromEditor(editor, tiers) {
  const bands = [];
  const seen = new Set();
  let number = 0;
  for (const row of editor.rows) {
    const blankLimit = String(row.limit ?? '').trim() === '';
    if (blankLimit && !filled(row.markups)) continue;
    number += 1;
    const cents = dollarsToCents(row.limit);
    if (cents === null) return { error: `Band ${number} needs a cost limit above $0, like 100.` };
    if (seen.has(cents)) return { error: `Two bands stop at ${dollarText(cents / 100)}. Give each band its own limit.` };
    seen.add(cents);
    const result = markupsFrom(row.markups, tiers);
    if (result.error) return { error: `Band ${number}: ${result.error}` };
    if (Object.keys(result.markups).length === 0) return { error: `Band ${number} needs at least one markup.` };
    bands.push({ up_to_cents: cents, markups: result.markups });
  }
  bands.sort((a, b) => a.up_to_cents - b.up_to_cents);
  if (filled(editor.rest)) {
    const result = markupsFrom(editor.rest, tiers);
    if (result.error) return { error: `Above the last band: ${result.error}` };
    bands.push({ up_to_cents: null, markups: result.markups });
  }
  if (bands.length > MAX_BANDS) return { error: `No more than ${MAX_BANDS} bands.` };
  return { bands };
}

// The words for the range each row covers, from the limits typed so far:
// "Under $100", "$100 to under $1,000", and for the rest "$1,000 and over".
export function rangeLabels(editor) {
  const limits = editor.rows.map((row) => dollarsToCents(row.limit));
  const valid = limits.filter((cents) => cents !== null).sort((a, b) => a - b);
  const rows = limits.map((cents) => {
    if (cents === null) return 'Enter a limit';
    const index = valid.indexOf(cents);
    if (index === 0) return `Under ${dollarText(cents / 100)}`;
    return `${dollarText(valid[index - 1] / 100)} to under ${dollarText(cents / 100)}`;
  });
  const rest = valid.length === 0 ? 'Every cost' : `${dollarText(valid[valid.length - 1] / 100)} and over`;
  return { rows, rest };
}

// What a $100 cost sells for at a markup, inc GST, to the nearest 5 cents (the backend's rule).
export function exampleCents(markup) {
  const value = markupNumber(markup);
  if (value === null || Number.isNaN(value)) return null;
  return Math.round((10000 * (100 + value) / 100 * 1.1) / 5) * 5;
}
