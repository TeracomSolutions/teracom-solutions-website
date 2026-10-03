// What a product page says beyond the price (Robert, 2026-10-03: when you
// drill into a product, show all the information that's available on it):
// warranty, weight and packed size, availability, the barcode for search
// engines, and the products the supplier lists as its accessories or
// alternatives.
//
// Pure functions with relative imports so the plain Node test runner can
// load this file directly.

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function positive(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// 29 not 29.0; 27.5 stays 27.5; 2.22 kg stays 2.22.
function short(n, places = 1) {
  return String(Number(n.toFixed(places)));
}

/** 36 -> "3 years", 18 -> "18 months", nothing -> null. */
export function warrantyText(months) {
  const n = positive(months);
  if (n === null) return null;
  if (n % 12 === 0) {
    const years = n / 12;
    return `${years} year${years === 1 ? '' : 's'}`;
  }
  return `${n} months`;
}

export function weightText(kg) {
  const n = positive(kg);
  return n === null ? null : `${short(n, 2)} kg`;
}

export function sizeText(lengthCm, widthCm, heightCm) {
  const sizes = [positive(lengthCm), positive(widthCm), positive(heightCm)];
  if (sizes.some((n) => n === null)) return null;
  return `${sizes.map((n) => short(n)).join(' × ')} cm`;
}

/** '2026-10-15' -> '15 October 2026'. */
export function deliveryDateText(isoDate) {
  const parts = String(isoDate || '').slice(0, 10).split('-').map(Number);
  if (parts.length !== 3) return null;
  const [year, month, day] = parts;
  if (!year || !month || !day || month > 12 || day > 31) return null;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export function availabilityText(stock, nextDelivery) {
  if (Number(stock) > 0) return 'In stock';
  const when = deliveryDateText(nextDelivery);
  return when ? `On order, expected ${when}` : 'Available to order';
}

/** A barcode search engines accept as a GTIN (8, 12, 13 or 14 digits), or null. */
export function gtinOf(barcode) {
  const digits = String(barcode || '').trim();
  if (![8, 12, 13, 14].includes(digits.length)) return null;
  for (const ch of digits) {
    if (ch < '0' || ch > '9') return null;
  }
  return digits;
}

/** The products in the store with these SKUs, in the order given, never the product itself. */
export function productsForSkus(products = [], skus = [], excludeId = null) {
  const bySku = new Map();
  for (const product of products) {
    if (product && product.sku) bySku.set(String(product.sku).toLowerCase(), product);
  }
  const found = [];
  for (const sku of skus || []) {
    const product = bySku.get(String(sku).toLowerCase());
    if (product && product.id !== excludeId && !found.includes(product)) found.push(product);
  }
  return found;
}