// Brands for the website (Robert, 2026-10-05): the 44 hand-written brands in
// lib/brands.js, plus every brand that arrives in a supplier's feed and is on
// a published store product. The backend (services/store_brands.py) keeps a
// row for each, with its text and logo; this merges the two lists. Pure, so
// it is unit-tested; lib/storeBrands.js fetches and caches.

// A brand's name without case or punctuation: "i-PRO" and "iPRO" match.
export function brandKey(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// A hand-written name can hold several spellings: "UNV / Uniview",
// "Reliance (XR Pro)". Each part counts, as well as the whole.
export function nameKeys(name) {
  const keys = [];
  const add = (text) => {
    const key = brandKey(text);
    if (key.length >= 2 && !keys.includes(key)) keys.push(key);
  };
  add(name);
  for (const part of String(name || '').split(new RegExp('[(),/]'))) add(part);
  return keys;
}

function rowKeys(row) {
  const keys = [];
  for (const text of [row.name, ...(row.aliases || [])]) {
    const key = brandKey(text);
    if (key && !keys.includes(key)) keys.push(key);
  }
  return keys;
}

export function defaultBody(name) {
  return `${name} products are available from the Teracom Store, backed by the team at Teracom Solutions in Melbourne. Browse the range below, or contact us for advice on the right product for your site.`;
}

// A brand that came from a feed: its own page text if staff wrote some,
// otherwise a plain default.
function storeBrand(row) {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline || `${row.name} products from the Teracom Store.`,
    body: row.body || defaultBody(row.name),
    logoUrl: row.logo_url || undefined,
    logoTile: Boolean(row.logo_tile),
    isStoreBrand: true,
    supported: Boolean(row.supported),
    isOwnBrand: false,
    matchKeys: rowKeys(row),
    products: row.products || 0,
  };
}

// staticBrands: lib/brands.js. rows: the backend's brands. Hand-written
// brands keep their text and logo and gain a logo from the backend only
// when they have none; every other row becomes a store brand.
export function mergeBrands(staticBrands, rows = []) {
  const used = new Set();
  const merged = staticBrands.map((brand) => {
    const keys = [...nameKeys(brand.name), brandKey(brand.slug)];
    const matches = rows.filter((row) => rowKeys(row).some((key) => keys.includes(key)));
    matches.forEach((row) => used.add(row.slug));
    const matchKeys = [...new Set([...keys, ...matches.flatMap(rowKeys)])];
    const logoRow = matches.find((row) => row.logo_url);
    return {
      ...brand,
      supported: true,
      matchKeys,
      products: matches.reduce((total, row) => total + (row.products || 0), 0),
      ...(!brand.logoFile && logoRow ? { logoUrl: logoRow.logo_url, logoTile: Boolean(logoRow.logo_tile) } : {}),
    };
  });
  const taken = new Set(staticBrands.map((brand) => brand.slug));
  const extra = rows.filter((row) => !used.has(row.slug) && !taken.has(row.slug)).map(storeBrand);
  return [...merged, ...extra];
}

// The store products that belong to a brand.
export function productsForBrand(products, brand) {
  const keys = new Set(brand.matchKeys || nameKeys(brand.name));
  return products.filter((product) => keys.has(brandKey(product.brand)));
}

// The brand page for a product's brand name, or null.
export function brandForProduct(brands, productBrand) {
  const key = brandKey(productBrand);
  if (!key) return null;
  return brands.find((brand) => (brand.matchKeys || []).includes(key)) || null;
}