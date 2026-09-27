/*
 * Pure functions for merging static products with catalogue data.
 * This module is used on the server and can be tested with node:test.
 */

/**
 * Generate a URL-friendly slug from an SKU
 *
 * @param {string} sku - The product SKU
 * @returns {string} A URL-friendly slug
 */
export function slugForSku(sku) {
  if (!sku) return 'product';
  
  // Convert to lowercase and replace runs of non-alphanumeric characters with hyphens
  let slug = sku.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  // Trim leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');
  
  // If the result is empty, return 'product'
  return slug || 'product';
}

/**
 * Convert a catalogue row to a product object
 *
 * @param {Object} row - The catalogue row data
 * @returns {Object} A product object
 */
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
    source: 'catalogue'
  };
}

/**
 * Merge static products with catalogue data
 *
 * @param {Array} staticProducts - Array of static product objects
 * @param {Array} rows - Array of catalogue row objects
 * @returns {Array} Merged array of product objects
 */
export function mergeCatalogue(staticProducts, rows) {
  // Create a map of static products by SKU (case-insensitive)
  const staticMap = new Map();
  staticProducts.forEach(product => {
    staticMap.set(product.sku.toLowerCase(), product);
  });

  // Process catalogue rows
  const mergedProducts = [];
  const seenSlugs = new Set();
  
  rows.forEach(row => {
    const sku = row.sku;
    const lowerSku = sku.toLowerCase();
    
    if (staticMap.has(lowerSku)) {
      // Replace static product with catalogue version but keep the original ID
      const staticProduct = staticMap.get(lowerSku);
      const catalogueProduct = fromCatalogueRow(row);
      
      // Keep static ID, description (if catalogue has none), type, features and dateAdded
      const mergedProduct = {
        ...catalogueProduct,
        id: staticProduct.id,
        description: row.description || staticProduct.description || '',
        type: staticProduct.type,
        features: staticProduct.features || [],
        source: 'catalogue',
        // Preserve dateAdded if it exists
        dateAdded: staticProduct.dateAdded
      };
      
      mergedProducts.push(mergedProduct);
      
      // Remove from static map to avoid processing again
      staticMap.delete(lowerSku);
    } else {
      // New catalogue product, add it to the list
      const catalogueProduct = fromCatalogueRow(row);
      mergedProducts.push(catalogueProduct);
    }
  });

  // Add remaining static products that didn't have catalogue matches
  staticProducts.forEach(product => {
    if (!staticMap.has(product.sku.toLowerCase())) return; // Already processed
    product.source = 'static';
    mergedProducts.push(product);
  });

  // Ensure unique slugs for catalogue products
  const slugCount = new Map();
  
  // First pass: count occurrences of each slug
  mergedProducts.forEach(product => {
    if (product.source === 'catalogue') {
      slugCount.set(product.id, (slugCount.get(product.id) || 0) + 1);
    }
  });

  // Second pass: resolve duplicate slugs
  mergedProducts.forEach(product => {
    if (product.source === 'catalogue' && slugCount.get(product.id) > 1) {
      let counter = 2;
      let newId = `${product.id}-${counter}`;
      
      // Keep incrementing until we find a unique ID
      while (seenSlugs.has(newId)) {
        counter++;
        newId = `${product.id}-${counter}`;
      }
      
      product.id = newId;
      seenSlugs.add(newId);
    } else {
      seenSlugs.add(product.id);
    }
  });

  // Sort catalogue products by name
  mergedProducts.sort((a, b) => {
    if (a.source === 'catalogue' && b.source === 'catalogue') {
      return a.name.localeCompare(b.name);
    } else if (a.source === 'catalogue') {
      return -1;
    } else if (b.source === 'catalogue') {
      return 1;
    }
    // Both are static or neither is catalogue, preserve original order
    return 0;
  });

  return mergedProducts;
}

/**
 * Calculate the unit price a customer pays for one unit of a product
 *
 * @param {Object} product - The product object
 * @param {Object|null} customer - The customer object or null if not signed in
 * @returns {number|null} The unit price in cents or null if no product
 */
export function unitPriceCents(product, customer) {
  // No product -> null
  if (!product) return null;
  
  // Subscription products always use the regular price
  if (product.type === 'subscription') {
    return product.priceCents;
  }
  
  // If customer has a tier and that tier exists in product's tier prices
  if (customer && customer.tier) {
    const lowerTier = customer.tier.toLowerCase();
    if (product.tierPricesCents && product.tierPricesCents[lowerTier] !== undefined) {
      return product.tierPricesCents[lowerTier];
    }
  }
  
  // Signed-in customer gets member price
  if (customer) {
    // Import the member pricing function
    const { memberPriceCents } = require('./products.js');
    return memberPriceCents(product);
  }
  
  // Guest customer pays full price
  return product.priceCents;
}

/**
 * Get the label for a customer tier
 *
 * @param {Object|null} customer - The customer object or null if not signed in
 * @param {Array} tiers - Array of tier objects with key and label properties
 * @returns {string|null} The tier label or null if no matching tier found
 */
export function tierLabel(customer, tiers) {
  // No customer -> null
  if (!customer || !customer.tier) return null;
  
  // Find matching tier (case-insensitive)
  const tierKey = customer.tier.toLowerCase();
  const tier = tiers.find(t => t.key.toLowerCase() === tierKey);
  
  return tier ? tier.label : null;
}