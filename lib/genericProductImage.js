// A generic picture of the kind of product, for a product we have no photo of yet
// (Robert, 2026-11-06: "if you can't find the exact photos, put generic photos in").
// Each says "Illustration only" on it, so nobody takes it for the real item. It is
// only shown on our pages: feeds and structured data keep to real photos.
import { artSlugForProduct } from './products.js';

const PICTURES = {
  cctv: 'cctv',
  'access-control': 'access-control',
  intrusion: 'intrusion',
  networking: 'networking',
  cable: 'cable',
};

export function genericImageFor(product) {
  const slug = product ? artSlugForProduct(product) : null;
  return `/assets/store-generic/${PICTURES[slug] || 'product'}.svg`;
}
