// The store's products for each line of a site plan's parts list (siteplan/quote.js), for
// the Site Plan Designer's "Parts and price". The lines only name a key; what to search for
// is looked up here from siteplan's PART_SEARCH, so a visitor cannot run any other search.
import { PART_SEARCH, excludedWords } from '../siteplan/quote.js';
import { normalise, queryTokens, searchProducts } from './storeSearch.js';

export const PART_CHOICES = 8;

/** The products worth offering for one parts-list line, best first. */
export function partChoices(products, key, limit = PART_CHOICES) {
  const search = PART_SEARCH[key];
  if (!search) return [];
  const not = excludedWords(key).map(normalise);
  const seen = new Set();
  const out = [];
  for (const q of search.q) {
    const tokens = queryTokens(q);
    const { items } = searchProducts(products, { q, categoryTitle: search.category || '', size: 60 });
    for (const product of items) {
      if (seen.has(product.id)) continue;
      // Every search word in the name itself: the store search also matches descriptions
      // and part numbers, which brings in radios for "intercom" and stands for "display".
      const name = ` ${normalise(product.name)} `;
      if (!tokens.every((token) => name.includes(` ${token}`))) continue;
      if (not.some((word) => name.includes(` ${word}`))) continue;
      seen.add(product.id);
      out.push(product);
      if (out.length >= limit) return out;
    }
  }
  return out;
}
