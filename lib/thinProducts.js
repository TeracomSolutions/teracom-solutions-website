// Products whose page has too little for Google to index (Robert,
// 2026-10-08): the supplier feed brought no photo or no description, and
// 2,865 such pages went live at once. Google's Search Console reports them as
// "Crawled - currently not indexed" and they count against the whole site, so
// a thin catalogue page is kept out of the sitemap and told not to be indexed
// until it has a photo and a description. The page itself stays on the
// website for anyone who has the link, and is indexable again as soon as it
// is filled in (pages refresh every five minutes).

export const MIN_DESCRIPTION = 40;

// Page metadata that keeps a page out of Google while letting it follow links.
export const THIN_ROBOTS = { robots: { index: false, follow: true } };

// Only catalogue products can be thin; the built-in products carry their own copy.
export function isThinProduct(product) {
  if (!product || product.source !== 'catalogue') return false;
  const noPhoto = !String(product.imageUrl || '').trim();
  const noWords = String(product.description || '').trim().length < MIN_DESCRIPTION;
  return noPhoto || noWords;
}