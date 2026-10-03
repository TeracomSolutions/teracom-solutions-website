// Which brands already have a page in the website's Brands section
// (lib/brands.js), so Data Feeds can flag an imported brand that still
// needs one. Names are compared on letters and digits only, so "Uniview"
// matches "UNV / Uniview" by its slug and "Power Shield" matches
// "PowerShield".
//
// Relative imports so the plain Node test runner can load this directly.
import { brands } from './brands.js';

export function brandKey(value) {
  return [...String(value || '').toLowerCase()]
    .filter((ch) => (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9'))
    .join('');
}

const PAGE_KEYS = new Set(brands.flatMap((brand) => [brandKey(brand.name), brandKey(brand.slug)]));

export function hasBrandPage(name) {
  const key = brandKey(name);
  return key !== '' && PAGE_KEYS.has(key);
}