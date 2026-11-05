import { categories } from './categories.js';

// The six placeholder products that came with the first version of the store (a sample reader, a
// motion detector and so on) were removed on 2026-11-05 at Robert's request: the store's real
// products all come from the backend catalogue now (lib/catalogueMerge.js).
export const products = [];

// Member discount on store items (Robert, 2026-09-22). Deliberately never shown
// as a percentage on the public site -- visitors are told members get
// "additional discounts" and see the member price once signed in. Checkout
// already requires a verified signed-in customer, so every checkout is charged
// the member price. Teracom AI subscriptions are not discounted.
export const MEMBER_DISCOUNT_PERCENT = 10;

export function memberPriceCents(product) {
  if (!product || product.priceCents == null || product.type === 'subscription') {
    return product ? product.priceCents : null;
  }
  return Math.round((product.priceCents * (100 - MEMBER_DISCOUNT_PERCENT)) / 100);
}

export function formatMoney(cents) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(cents / 100);
}

export function findProduct(id) {
  return products.find((p) => p.id === id);
}

export function getCategories() {
  const categories = [...new Set(products.map((p) => p.category))];
  return categories.sort();
}

export function getProductsByCategory(category) {
  return products.filter((p) => p.category === category);
}

export function getNewArrivals() {
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  return products.filter((p) => {
    if (!p.dateAdded) return false;
    const added = new Date(p.dateAdded).getTime();
    if (Number.isNaN(added)) return false;
    return now - added <= THIRTY_DAYS_MS;
  });
}

// --- Product pages ---------------------------------------------------------
// Every product gets its own page at /store/product/<id>. A flat path rather
// than nesting under the category: Software, Digital and Services listings
// have no category page of their own, and a URL scheme that can't address a
// third of the catalogue isn't a scheme.

export function productPath(product) {
  return product ? `/store/product/${product.id}` : '/store';
}

export function findProductBySlug(slug) {
  return products.find((p) => p.id === slug);
}

/** The store category whose listing this product appears on, if any. */
export function storeCategoryForProduct(product) {
  if (!product) return null;
  return categories.find((c) => c.productCategory === product.category) || null;
}

/** Slug for StoreCategoryArt, falling back to the product's own category. */
export function artSlugForProduct(product) {
  if (!product) return null;
  const category = storeCategoryForProduct(product);
  return category ? category.slug : product.category.toLowerCase();
}

// Prices are stored and shown GST-inclusive, because the ACL requires the
// total price to be the most prominent figure on a page a consumer can reach.
// Trade buyers quote in ex-GST, so both are displayed -- and GST is exactly
// one eleventh of a GST-inclusive Australian price.
export function gstCents(cents) {
  return cents == null ? null : Math.round(cents / 11);
}

export function exGstCents(cents) {
  return cents == null ? null : cents - gstCents(cents);
}

export function getRelatedProducts(product, limit = 3) {
  if (!product) return [];
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}
