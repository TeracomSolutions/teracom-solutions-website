// What a signed-in customer's saved cart holds (Sales > Carts, Robert 2026-10-25): the product code, name,
// quantity and shelf price of each line. Nothing about the customer goes in it; the website's server adds
// who it belongs to from their sign-in, and saves nothing for a visitor who is not signed in.

export const SNAPSHOT_DELAY_MS = 2000;

export function snapshotItems(lines) {
  return (Array.isArray(lines) ? lines : [])
    .filter((line) => line && line.product && line.quantity > 0)
    .slice(0, 100)
    .map((line) => ({
      sku: String(line.product.sku || line.productId || '').slice(0, 100),
      name: String(line.product.name || '').slice(0, 255),
      quantity: Math.min(10000, Math.max(1, Math.floor(Number(line.quantity) || 1))),
      unit_price_cents: Math.max(0, Math.round(Number(line.product.priceCents) || 0)),
    }))
    .filter((item) => item.sku);
}

export function snapshotKey(items) {
  return items.map((item) => item.sku + 'x' + item.quantity).join('|');
}
