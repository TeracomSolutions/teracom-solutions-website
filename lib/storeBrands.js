// Server-only. The website's brands: the hand-written ones in lib/brands.js
// merged with the backend's store brands (every brand on a published
// product, with its logo), cached in this process for five minutes. If the
// backend cannot be reached the last good copy is used, then the
// hand-written list alone: the brand pages never go blank.
if (typeof window !== 'undefined') {
  throw new Error('lib/storeBrands.js must only be used on the server.');
}

import { brands as staticBrands } from './brands.js';
import { fetchStoreBrands } from './api/storeBrands.js';
import { mergeBrands } from './storeBrandsMerge.js';

const CACHE_TTL_MS = 5 * 60 * 1000;

let cached = null;
let cachedAt = 0;

export async function getBrands() {
  const now = Date.now();
  if (cached && now - cachedAt < CACHE_TTL_MS) return cached;
  try {
    const data = await fetchStoreBrands();
    cached = mergeBrands(staticBrands, data.brands || []);
    cachedAt = now;
    return cached;
  } catch (error) {
    console.warn('Store brands unavailable, using the hand-written list', error?.message || error);
    return cached || mergeBrands(staticBrands, []);
  }
}

export async function findBrandAsync(slug) {
  return (await getBrands()).find((brand) => brand.slug === slug) || null;
}