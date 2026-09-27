// Server-only. The store's product list: the built-in products merged with
// the admin catalogue from the backend, cached in this process for five
// minutes. If the backend cannot be reached the last good copy is used, and
// before there is one, the built-in list alone -- the store never goes blank
// because the catalogue call failed.
if (typeof window !== 'undefined') {
  throw new Error('lib/catalogue.js must only be used on the server.');
}

import { fetchStorefrontCatalogue } from './api/storefront.js';
import { getCurrentCustomer } from './api/customerAuth.js';
import { mergeCatalogue } from './catalogueMerge.js';
import { getNewArrivals, products as staticProducts } from './products.js';

const CACHE_TTL_MS = 5 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

let cached = null;
let cachedAt = 0;

export async function getCatalogue() {
  const now = Date.now();
  if (cached && now - cachedAt < CACHE_TTL_MS) return cached;
  try {
    const data = await fetchStorefrontCatalogue();
    cached = {
      products: mergeCatalogue(staticProducts, data.products || []),
      tiers: data.tiers || [],
      source: 'catalogue',
      fetchedAt: data.generated_at || new Date(now).toISOString(),
    };
    cachedAt = now;
    return cached;
  } catch (error) {
    console.warn('Store catalogue unavailable, using the built-in product list', error?.message || error);
    if (cached) return cached;
    return {
      products: mergeCatalogue(staticProducts, []),
      tiers: [],
      source: 'static',
      fetchedAt: new Date(now).toISOString(),
    };
  }
}

export async function getAllProducts() {
  return (await getCatalogue()).products;
}

export async function findProductAsync(id) {
  if (!id) return null;
  const products = await getAllProducts();
  const wanted = String(id).toLowerCase();
  return products.find((p) => p.id === id) || products.find((p) => p.sku && p.sku.toLowerCase() === wanted) || null;
}

export async function getProductsByCategoryAsync(category) {
  return (await getAllProducts()).filter((p) => p.category === category);
}

export async function getNewArrivalsAsync() {
  const { products } = await getCatalogue();
  const cutoff = Date.now() - THIRTY_DAYS_MS;
  const seen = new Set();
  const arrivals = [];
  for (const product of getNewArrivals()) {
    seen.add(product.id);
    arrivals.push(products.find((p) => p.id === product.id) || product);
  }
  for (const product of products) {
    if (product.source !== 'catalogue' || seen.has(product.id) || !product.updatedAt) continue;
    const updated = new Date(product.updatedAt).getTime();
    if (!Number.isNaN(updated) && updated >= cutoff) {
      seen.add(product.id);
      arrivals.push(product);
    }
  }
  return arrivals;
}

/** { id, tier } for a signed-in customer, or null. A broken session is a guest for pricing only. */
export async function getCustomerPricing(token) {
  if (!token) return null;
  try {
    const customer = await getCurrentCustomer(token);
    return { id: customer.id, tier: customer.pricing_tier || null };
  } catch {
    return null;
  }
}

export function invalidateCatalogueCache() {
  cached = null;
  cachedAt = 0;
}
