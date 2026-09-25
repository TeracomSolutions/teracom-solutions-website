// What a cart costs, computed from the product catalogue rather than from
// anything the browser sent.
//
// Both the cart preview and the checkout session need the same subtotal, and
// a coupon is worth a percentage of it -- so if these two ever disagreed, the
// discount shown in the cart would not be the discount charged. One function,
// used by both.
//
// Relative imports so the plain Node test runner can load this directly.
import { findProduct, memberPriceCents } from '../lib/products.js';

/**
 * Resolve raw cart items against the catalogue.
 *
 * Returns { lines, missing } -- `missing` holds any productId that is no
 * longer in the catalogue, which the caller must treat as an error rather
 * than silently dropping from the order.
 */
export function resolveLines(items = []) {
  const lines = [];
  const missing = [];
  for (const item of items) {
    const product = findProduct(item.productId);
    if (!product) {
      missing.push(item.productId);
      continue;
    }
    lines.push({ item, product });
  }
  return { lines, missing };
}

/**
 * Subtotal in cents at the price the customer will actually be charged.
 *
 * Only signed-in customers reach checkout, so that is the member price.
 */
export function subtotalCents(lines) {
  return lines.reduce((sum, { item, product }) => sum + memberPriceCents(product) * item.quantity, 0);
}

export function needsShipping(lines) {
  return lines.some(({ product }) => product.type === 'hardware');
}

/**
 * The order total after a discount, floored at zero.
 *
 * A discount larger than the goods must not eat into the shipping line or
 * produce a negative total -- Stripe rejects the latter and no customer
 * should ever be shown it.
 */
export function totalCents({ subtotal, shipping = 0, discount = 0 }) {
  const goods = Math.max(0, subtotal - Math.max(0, discount));
  return goods + shipping;
}
