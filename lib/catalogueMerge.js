// How the store's product list is put together and priced.
//
// Two sources: the built-in list in lib/products.js (subscriptions, digital
// goods, services and a handful of hardware lines with their own copy) and
// the admin catalogue (supplier price lists imported through the console).
// The catalogue wins on price and stock for a SKU that appears in both; the
// built-in entry keeps its id, copy and type so existing URLs survive.
//
// Pure functions with relative imports so the plain Node test runner can
// load this file directly.
import { memberPriceCents } from './products.js';

export function slugForSku(sku) {
  const slug = String(sku || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'product';
}

export function fromCatalogueRow(row) {
  return {
    id: slugForSku(row.sku),
    sku: row.sku,
    name: row.name,
    description: row.description || '',
    priceCents: row.price_cents,
    category: row.category,
    type: 'hardware',
    brand: row.brand || undefined,
    supplier: row.supplier || undefined,
    stock: row.stock,
    tierPricesCents: row.tier_prices_cents || {},
    features: [],
    updatedAt: row.updated_at || null,
    source: 'catalogue',
  };
}

function bySkuKey(sku) {
  return String(sku || '').toLowerCase();
}

/**
 * Built-in products first, in their own order (a catalogue row with the same
 * SKU replaces the price, stock, brand and supplier but keeps id, type,
 * features, dateAdded and the built-in description when the row has none).
 * Then catalogue-only products, by name. Every id is unique: a catalogue slug
 * that collides with an existing id gets -2, -3 and so on.
 */
export function mergeCatalogue(staticProducts = [], rows = []) {
  const rowsBySku = new Map();
  for (const row of rows) {
    if (row && row.sku && !rowsBySku.has(bySkuKey(row.sku))) rowsBySku.set(bySkuKey(row.sku), row);
  }

  const merged = [];
  const takenIds = new Set();
  for (const product of staticProducts) {
    const row = rowsBySku.get(bySkuKey(product.sku));
    if (row) {
      const fromRow = fromCatalogueRow(row);
      merged.push({
        ...fromRow,
        id: product.id,
        description: row.description || product.description || '',
        type: product.type,
        features: product.features || [],
        dateAdded: product.dateAdded,
      });
      rowsBySku.delete(bySkuKey(product.sku));
    } else {
      merged.push({ ...product, source: 'static' });
    }
    takenIds.add(product.id);
  }

  const extra = [...rowsBySku.values()]
    .map(fromCatalogueRow)
    .sort((a, b) => a.name.localeCompare(b.name, 'en-AU', { sensitivity: 'base' }));
  for (const product of extra) {
    let id = product.id;
    let n = 2;
    while (takenIds.has(id)) {
      id = `${product.id}-${n}`;
      n += 1;
    }
    takenIds.add(id);
    merged.push(id === product.id ? product : { ...product, id });
  }
  return merged;
}

/**
 * What this customer pays for one unit, in cents.
 * customer: null (guest) or { tier: 'Gold' | null }.
 */
export function unitPriceCents(product, customer) {
  if (!product) return null;
  if (product.type === 'subscription') return product.priceCents;
  if (customer && customer.tier) {
    const tierPrice = product.tierPricesCents ? product.tierPricesCents[String(customer.tier).toLowerCase()] : undefined;
    if (typeof tierPrice === 'number') return tierPrice;
  }
  if (customer) return memberPriceCents(product);
  return product.priceCents;
}

export function tierLabel(customer, tiers = []) {
  if (!customer || !customer.tier) return null;
  const key = String(customer.tier).toLowerCase();
  const tier = tiers.find((t) => String(t.key).toLowerCase() === key);
  return tier ? tier.label : null;
}
