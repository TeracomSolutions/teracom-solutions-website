// Google Shopping feed helpers

import { cutWords } from './seoText.js';
import { MIN_DESCRIPTION } from './thinProducts.js';

export const FEED_CODES = {
  no_image: { severity: 'problem', label: 'No photo', help: 'Google needs a photo of the product.' },
  no_description: { severity: 'problem', label: 'No description', help: 'Google needs a description of at least 40 characters.' },
  no_brand: { severity: 'problem', label: 'No brand', help: 'Google needs the brand of the product.' },
  no_price: { severity: 'problem', label: 'No price', help: 'The product has no price above zero.' },
  bad_gtin: { severity: 'note', label: 'Barcode number is not valid', help: 'The barcode number fails its check digit, so it is left out of the feed.' },
  no_gtin: { severity: 'note', label: 'No barcode number', help: 'Without a barcode number Google matches the product by brand and part number only.' },
  title_long: { severity: 'note', label: 'Name longer than 150 characters', help: 'Google shows 150 characters of a name, so the feed cuts it.' }
};

/**
 * Check if text is a valid GTIN (Global Trade Item Number)
 * @param {string} text - The text to validate
 * @returns {boolean} - True if valid
 */
export function isValidGtin(text) {
  // Return false when text is not a string
  if (!text || typeof text !== 'string') return false;

  // Trim it
  const trimmed = text.trim();

  // Return false when its length is not 8, 12, 13 or 14
  if (trimmed.length !== 8 && trimmed.length !== 12 && trimmed.length !== 13 && trimmed.length !== 14) return false;

  // Return false when any character is not a digit
  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed[i] < '0' || trimmed[i] > '9') return false;
  }

  // Compute the GS1 check digit
  const digits = trimmed.slice(0, -1);
  const checkDigit = parseInt(trimmed.slice(-1));

  // Go from right to left, multiply the rightmost of them by 3, the next by 1, the next by 3 and so on
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    const digit = parseInt(digits[i]);
    // Go from right to left, multiply by 3 for odd positions and 1 for even positions
    if ((digits.length - i) % 2 === 1) {
      sum += digit * 3;
    } else {
      sum += digit;
    }
  }

  // The check digit is (10 - (sum modulo 10)) modulo 10
  const calculatedCheckDigit = (10 - (sum % 10)) % 10;

  return calculatedCheckDigit === checkDigit;
}

/**
 * Convert HTML to plain text
 * @param {string} html - The HTML string to convert
 * @returns {string} - Plain text version
 */

/**
 * Get list of problem codes for a product
 * @param {Object} product - The product object
 * @returns {Array<string>} - Array of problem codes
 */
export function productProblems(product) {
  const problems = [];

  // Check image
  if (!product.imageUrl || !product.imageUrl.trim()) {
    problems.push('no_image');
  }

  // Check description
  let descriptionText = '';
  if (product.description && product.description.trim()) {
    descriptionText = product.description;
  } else if (product.descriptionHtml && product.descriptionHtml.trim()) {
    descriptionText = plainText(product.descriptionHtml);
  }

  if (descriptionText.length < MIN_DESCRIPTION) {
    problems.push('no_description');
  }

  // Check brand
  if (!product.brand || !product.brand.trim()) {
    problems.push('no_brand');
  }

  // Check price
  if (typeof product.priceCents !== 'number' || product.priceCents <= 0) {
    problems.push('no_price');
  }

  // Check barcode
  if (!product.barcode || !product.barcode.trim()) {
    problems.push('no_gtin');
  } else if (!isValidGtin(product.barcode)) {
    problems.push('bad_gtin');
  }

  // Check title length
  if (product.name && product.name.length > 150) {
    problems.push('title_long');
  }

  return problems;
}

/**
 * Check if a product is ready for Google Shopping feed
 * @param {Object} product - The product object
 * @returns {boolean} - True if ready
 */
export function isReady(product) {
  // Must be hardware type
  if (product.type !== 'hardware') return false;

  // Get all problems
  const problems = productProblems(product);

  // Check if any problem has severity 'problem'
  for (const code of problems) {
    if (FEED_CODES[code].severity === 'problem') {
      return false;
    }
  }

  return true;
}

/**
 * Create a feed item from a product
 * @param {Object} product - The product object
 * @param {string} origin - Base URL of the site
 * @returns {Object|null} - Feed item or null if not ready
 */
export function feedItem(product, origin) {
  if (!isReady(product)) return null;

  const item = {};

  // id (sku, trimmed, at most 50 characters)
  item.id = product.sku ? product.sku.trim().slice(0, 50) : '';

  // title (name with whitespace collapsed, cut to 150 characters with cutWords)
  if (product.name) {
    const cleanName = product.name.replace(/\s+/g, ' ').trim();
    item.title = cutWords(cleanName, 150);
  } else {
    item.title = '';
  }

  // description (plain text of the description or descriptionHtml, at most 5000 characters)
  let descriptionText = '';
  if (product.description && product.description.trim()) {
    descriptionText = product.description;
  } else if (product.descriptionHtml && product.descriptionHtml.trim()) {
    descriptionText = plainText(product.descriptionHtml);
  }

  // Limit to 5000 characters
  if (descriptionText.length > 5000) {
    descriptionText = descriptionText.slice(0, 5000);
  }

  item.description = descriptionText;

  // link
  item.link = origin + '/store/product/' + product.id;

  // imageLink
  if (product.imageUrl) {
    if (product.imageUrl.startsWith('/')) {
      item.imageLink = origin + product.imageUrl;
    } else {
      item.imageLink = product.imageUrl;
    }
  } else {
    item.imageLink = '';
  }

  // Fix spaces in imageLink URL
  if (item.imageLink) {
    item.imageLink = item.imageLink.trim().split(' ').join('%20');
  }

  // availability ('in_stock' when stock is a number above zero, otherwise 'backorder')
  item.availability = (typeof product.stock === 'number' && product.stock > 0) ? 'in_stock' : 'backorder';
  if (item.availability === 'backorder') {
    item.availabilityDate = availabilityDateFor(new Date());
  }

  // price (priceCents divided by 100 with exactly two decimals, then a space and AUD)
  if (typeof product.priceCents === 'number') {
    item.price = (product.priceCents / 100).toFixed(2) + ' AUD';
  } else {
    item.price = '0.00 AUD';
  }

  // brand
  item.brand = product.brand || '';

  // gtin (only when valid)
  if (product.barcode && isValidGtin(product.barcode)) {
    item.gtin = product.barcode.trim();
  }

  // mpn (manufacturerSku or sku when there is none, trimmed, at most 70 characters)
  const mpnValue = product.manufacturerSku ? product.manufacturerSku.trim() : (product.sku ? product.sku.trim() : '');
  item.mpn = mpnValue.slice(0, 70);

  // condition ('new')
  item.condition = 'new';

  // productType (category or empty string)
  item.productType = product.category || '';

  return item;
}

/**
 * Escape text for XML
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export function escapeXml(text) {
  if (text === null || text === undefined) return '';

  return String(text)
    .split("").filter((c) => { const n = c.charCodeAt(0); return n >= 32 ? n < 65534 : n === 9 || n === 10 || n === 13; }).join("")
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Build XML feed from items
 * @param {Array<Object>} items - Array of feed items
 * @param {string} origin - Base URL of the site
 * @returns {string} - XML string
 */
export function buildFeedXml(items, origin) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n';
  xml += '  <channel>\n';
  xml += '    <title>Teracom Solutions</title>\n';
  xml += '    <link>' + escapeXml(origin) + '</link>\n';
  xml += '    <description>Teracom Solutions product feed</description>\n';

  for (const item of items) {
    xml += '    <item>\n';
    xml += '      <g:id>' + escapeXml(item.id) + '</g:id>\n';
    xml += '      <title>' + escapeXml(item.title) + '</title>\n';
    xml += '      <description>' + escapeXml(item.description) + '</description>\n';
    xml += '      <link>' + escapeXml(item.link) + '</link>\n';
    xml += '      <g:image_link>' + escapeXml(item.imageLink) + '</g:image_link>\n';
    xml += '      <g:availability>' + escapeXml(item.availability) + '</g:availability>\n';
    if (item.availabilityDate) {
      xml += '      <g:availability_date>' + escapeXml(item.availabilityDate) + '</g:availability_date>\n';
    }
    xml += '      <g:price>' + escapeXml(item.price) + '</g:price>\n';
    xml += '      <g:brand>' + escapeXml(item.brand) + '</g:brand>\n';

    if (item.gtin) {
      xml += '      <g:gtin>' + escapeXml(item.gtin) + '</g:gtin>\n';
    }

    xml += '      <g:mpn>' + escapeXml(item.mpn) + '</g:mpn>\n';
    xml += '      <g:condition>' + escapeXml(item.condition) + '</g:condition>\n';

    if (item.productType) {
      xml += '      <g:product_type>' + escapeXml(item.productType) + '</g:product_type>\n';
    }

    xml += '    </item>\n';
  }

  xml += '  </channel>\n';
  xml += '</rss>\n';

  return xml;
}

/**
 * Summarise products for reporting
 * @param {Array<Object>} products - Array of product objects
 * @returns {Object} - Summary object
 */
export function summarise(products) {
  const summary = {
    hardware: 0,
    ready: 0,
    counts: {}
  };

  // Initialize counts with all codes set to 0
  for (const code in FEED_CODES) {
    summary.counts[code] = 0;
  }

  for (const product of products) {
    if (product.type === 'hardware') {
      summary.hardware++;

      // Check if ready
      if (isReady(product)) {
        summary.ready++;
      }

      // Count problems
      const problems = productProblems(product);
      for (const code of problems) {
        summary.counts[code]++;
      }
    }
  }

  return summary;
}

/**
 * List products with specific criteria
 * @param {Array<Object>} products - Array of product objects
 * @param {string} code - Filter by specific code (optional)
 * @param {string} q - Search query (optional)
 * @returns {Array<Object>} - Filtered array of products
 */
export function listProducts(products, code, q) {
  // Only consider hardware products
  let filtered = products.filter(p => p.type === 'hardware');

  // Apply code filter if specified
  if (code) {
    filtered = filtered.filter(product => productProblems(product).includes(code));
  } else {
    // Keep only products with problem-level codes
    filtered = filtered.filter(product => {
      const problems = productProblems(product);
      return problems.some(problemCode => FEED_CODES[problemCode].severity === 'problem');
    });
  }

  // Apply search query if specified
  if (q && q.trim()) {
    const searchTerm = q.toLowerCase().trim();
    filtered = filtered.filter(product => {
      return (
        (product.name && product.name.toLowerCase().includes(searchTerm)) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm)) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm))
      );
    });
  }

  // Add problems to each product and sort by name
  const result = filtered.map(product => {
    const problems = productProblems(product);
    const problemDetails = problems.map(problemCode => ({
      code: problemCode,
      label: FEED_CODES[problemCode].label,
      severity: FEED_CODES[problemCode].severity
    }));

    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      brand: product.brand,
      priceCents: product.priceCents,
      problems: problemDetails
    };
  });

  // Sort by name (case insensitive)
  result.sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  return result;
}

/**
 * Turns HTML into plain text
 * @param {string} html - The HTML string to convert
 * @returns {string} - Plain text version
 */
export function plainText(html) {
  // Return empty string when html is null, undefined, or not a string
  if (html === null || html === undefined || typeof html !== 'string') return '';

  // Walk through the text one character at a time
  let output = '';
  let inTag = false;
  for (let i = 0; i < html.length; i++) {
    const char = html[i];
    if (char === '<') {
      inTag = true;
      output += ' ';
    } else if (char === '>') {
      inTag = false;
    } else if (!inTag) {
      output += char;
    }
  }

  // Convert entities using split and join
  output = output.split('&nbsp;').join(' ');
  output = output.split('&lt;').join('<');
  output = output.split('&gt;').join('>');
  output = output.split('&quot;').join('"');
  output = output.split('&#39;').join("'");
  output = output.split('&amp;').join('&');

  // Collapse whitespace
  let finalOutput = '';
  let lastWasSpace = false;
  for (let i = 0; i < output.length; i++) {
    const char = output[i];
    const code = char.charCodeAt(0);
    if (code <= 32) {
      if (!lastWasSpace) {
        finalOutput += ' ';
        lastWasSpace = true;
      }
    } else {
      finalOutput += char;
      lastWasSpace = false;
    }
  }

  return finalOutput.trim();
}
/**
 * The availability date Google requires for a product that is on backorder:
 * seven days after the given moment, as an ISO 8601 date at midnight UTC.
 * @param {Date} now - The moment to count from
 * @returns {string} - For example 2026-10-19T00:00:00Z
 */
export function availabilityDateFor(now) {
  const later = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return later.toISOString().slice(0, 10) + 'T00:00:00Z';
}
