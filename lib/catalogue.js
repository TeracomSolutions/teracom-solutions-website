// Server-only. Caches the merged catalogue data for 5 minutes.
//
// This module handles caching of the merged catalogue (static products + catalogue data)
// and provides functions to access it.

if (typeof window !== 'undefined') {
  throw new Error('lib/catalogue.js must only be used on the server.');
}

import { fetchStorefrontCatalogue } from './api/storefront.js';
import { mergeCatalogue } from './catalogueMerge.js';
import { getNewArrivals } from './products.js';
import { getCurrentCustomer } from './api/customerAuth.js';

// Module-level cache
let cachedCatalogue = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get the merged catalogue data (static + catalogue)
 *
 * @returns {Object} The catalogue object with products, tiers and source information
 */
export async function getCatalogue() {
  const now = Date.now();
  
  // Return cached version if still valid
  if (cachedCatalogue && (now - cacheTimestamp < CACHE_TTL)) {
    return cachedCatalogue;
  }
  
  try {
    // Fetch fresh data from backend
    const { tiers, products: catalogueProducts, generated_at } = await fetchStorefrontCatalogue();
    
    // Import static products (this is a circular dependency, but it's acceptable in server context)
    const { getProducts } = await import('./products.js');
    const staticProducts = await getProducts();
    
    // Merge the products
    const mergedProducts = mergeCatalogue(staticProducts, catalogueProducts);
    
    // Create the catalogue object
    const catalogue = {
      products: mergedProducts,
      tiers,
      source: 'catalogue',
      fetchedAt: generated_at
    };
    
    // Update cache
    cachedCatalogue = catalogue;
    cacheTimestamp = now;
    
    return catalogue;
  } catch (error) {
    console.warn('Failed to fetch catalogue, returning cached version or static products', error);
    
    // If we have a previous cached version, return it
    if (cachedCatalogue) {
      return cachedCatalogue;
    }
    
    // Otherwise, fall back to static products only
    try {
      const { getProducts } = await import('./products.js');
      const staticProducts = await getProducts();
      
      return {
        products: staticProducts,
        tiers: [],
        source: 'static',
        fetchedAt: new Date().toISOString()
      };
    } catch (fallbackError) {
      console.error('Failed to load static products as fallback:', fallbackError);
      
      return {
        products: [],
        tiers: [],
        source: 'static',
        fetchedAt: new Date().toISOString()
      };
    }
  }
}

/**
 * Get all products from the catalogue (cached)
 *
 * @returns {Array} Array of product objects
 */
export async function getAllProducts() {
  const catalogue = await getCatalogue();
  return catalogue.products;
}

/**
 * Find a product by ID or SKU (case-insensitive)
 *
 * @param {string} id - The product ID or SKU
 * @returns {Object|null} The product object or null if not found
 */
export async function findProductAsync(id) {
  const products = await getAllProducts();
  
  // First try to find by ID
  let product = products.find(p => p.id === id);
  
  // If not found, try to find by SKU (case-insensitive)
  if (!product) {
    product = products.find(p => p.sku && p.sku.toLowerCase() === id.toLowerCase());
  }
  
  return product || null;
}

/**
 * Get products by category
 *
 * @param {string} category - The category name
 * @returns {Array} Array of product objects in that category
 */
export async function getProductsByCategoryAsync(category) {
  const products = await getAllProducts();
  return products.filter(p => p.category === category);
}

/**
 * Get new arrivals (static + catalogue)
 *
 * @returns {Array} Array of new arrival products
 */
export async function getNewArrivalsAsync() {
  const catalogue = await getCatalogue();
  
  // Get static new arrivals
  const staticNewArrivals = await getNewArrivals();
  
  // Filter catalogue-only products that are recent (within 30 days)
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
  
  const catalogueNewArrivals = catalogue.products.filter(product => {
    // Skip if product doesn't have updated_at or source is not 'catalogue'
    if (!product.updated_at || product.source !== 'catalogue') return false;
    
    // Check if updated within the last 30 days
    const updatedAt = new Date(product.updated_at);
    return updatedAt >= thirtyDaysAgo;
  });
  
  // Combine and deduplicate by ID (catalogue products take precedence)
  const seenIds = new Set();
  const allNewArrivals = [];
  
  // Add static new arrivals first
  staticNewArrivals.forEach(product => {
    if (!seenIds.has(product.id)) {
      allNewArrivals.push(product);
      seenIds.add(product.id);
    }
  });
  
  // Then add catalogue arrivals (skip those already added)
  catalogueNewArrivals.forEach(product => {
    if (!seenIds.has(product.id)) {
      allNewArrivals.push(product);
      seenIds.add(product.id);
    }
  });
  
  return allNewArrivals;
}

/**
 * Get customer pricing information
 *
 * @param {string|null} token - The authentication token
 * @returns {Object|null} Customer pricing object or null if error
 */
export async function getCustomerPricing(token) {
  // No token -> guest
  if (!token) return null;
  
  try {
    const customer = await getCurrentCustomer(token);
    return {
      id: customer.id,
      tier: customer.pricing_tier || null
    };
  } catch (error) {
    // Broken session is treated as guest for pricing purposes
    console.warn('Failed to get customer pricing, treating as guest', error);
    return null;
  }
}

/**
 * Invalidate the catalogue cache (for testing and admin use)
 */
export function invalidateCatalogueCache() {
  cachedCatalogue = null;
  cacheTimestamp = 0;
}