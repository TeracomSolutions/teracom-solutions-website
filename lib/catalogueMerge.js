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
    // Shipping weight (kg) and packed size (cm), for the freight quote.
    weightKg: row.weight_kg ?? null,
    lengthCm: row.length_cm ?? null,
    widthCm: row.width_cm ?? null,
    heightCm: row.height_cm ?? null,
    tierPricesCents: row.tier_prices_cents || {},
    // The supplier's photo, and when staff put the product live.
    imageUrl: row.image_url || null,
    publishedAt: row.published_at || null,
    // The rest of what the supplier's feed says, for the product page.
    // descriptionHtml is cleaned by the backend to a safe set of tags.
    descriptionHtml: row.description_html || null,
    manufacturerSku: row.manufacturer_sku || null,
    barcode: row.barcode || null,
    warrantyMonths: row.warranty_months ?? null,
    nextDelivery: row.next_delivery || null,
    accessorySkus: row.accessory_skus || [],
    alternativeSkus: row.alternative_skus || [],
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
 *
 * Catalogue products carry a price for every tier, worked out by the
 * backend as cost plus that tier's markup (never above RRP). A signed-in
 * customer without a Zoho tier pays the Member tier's price. Built-in
 * products have no tier prices and keep the member discount off RRP.
 */
export function unitPriceCents(product, customer) {
  if (!product) return null;
  if (product.type === 'subscription') return product.priceCents;
  if (customer) {
    const prices = product.tierPricesCents || {};
    const key = customer.tier ? String(customer.tier).toLowerCase() : 'member';
    if (typeof prices[key] === 'number') return prices[key];
    if (typeof prices.member === 'number') return prices.member;
    return memberPriceCents(product);
  }
  return product.priceCents;
}

/**
 * Just what a product tile needs (and unitPriceCents for the price), so a
 * category page with hundreds of products does not send every description
 * to the browser.
 */
export function forTiles(products = []) {
  return products.map((p) => ({
    id: p.id,
    sku: p.sku,
    // The maker's part number, so a search for it finds the tile.
    mpn: p.manufacturerSku || null,
    name: p.name,
    brand: p.brand || null,
    type: p.type,
    priceCents: p.priceCents,
    tierPricesCents: p.tierPricesCents || {},
    imageUrl: p.imageUrl || null,
    // For the availability line: in stock, or when stock is expected.
    stock: p.stock ?? null,
    nextDelivery: p.nextDelivery || null,
  }));
}

export function tierLabel(customer, tiers = []) {
  if (!customer || !customer.tier) return null;
  const key = String(customer.tier).toLowerCase();
  const tier = tiers.find((t) => String(t.key).toLowerCase() === key);
  return tier ? tier.label : null;
}