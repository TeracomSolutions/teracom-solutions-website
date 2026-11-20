// Server side of the Estimator (lib/estimator.js): materials can only be the store's own
// products, so every product line is looked up in the catalogue and given its name, part
// number and this customer's price from there. A product no longer in the store keeps its
// line, marked unavailable, so the customer can swap it.
import { cleanEstimate, estimateTotals } from './estimator.js';
import { unitPriceCents } from './catalogueMerge.js';
import { productPath } from './products.js';

export function priceEstimate(raw, products, customer, now = new Date().toISOString()) {
  const estimate = cleanEstimate(raw, now);
  const byId = new Map(products.map((p) => [String(p.id), p]));
  for (const section of estimate.sections) {
    for (const line of section.lines) {
      if (line.type !== 'product') continue;
      const product = byId.get(line.productId);
      if (!product || product.type === 'subscription') {
        line.unavailable = true;
        continue;
      }
      const price = unitPriceCents(product, customer);
      line.unavailable = false;
      line.name = String(product.name || '').slice(0, 300);
      line.sku = String(product.sku || '').slice(0, 60);
      line.brand = String(product.brand || '').slice(0, 80);
      line.href = productPath(product);
      line.unitCents = typeof price === 'number' ? price : null;
    }
  }
  return { ...estimate, totals: estimateTotals(estimate) };
}

/** What the product search sends to the browser for one product. */
export function productChoice(product, customer) {
  return {
    id: String(product.id),
    sku: product.sku || '',
    name: product.name,
    brand: product.brand || '',
    category: product.category || '',
    imageUrl: product.imageUrl || null,
    stock: product.stock ?? null,
    href: productPath(product),
    unitCents: unitPriceCents(product, customer),
  };
}
