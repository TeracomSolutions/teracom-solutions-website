// Server-only. The Teracom AI prices, A$ a month ex GST, keyed by slug, with
// "base-platform" for the base platform fee every customer pays. They are read from the
// backend price list (the TAI- rows in the console, Robert 4 November 2026), so a price
// changed there reaches every page within the hour, or at once with Publish prices.
// BUNDLED is price list version 3 (teracom-ai-docs
// Reports/DEPARTMENT_PRICING_MODEL_v3_2026-11-04.md), used only when the backend cannot be
// read. Nothing is shown while PRICES_PUBLISHED in lib/savings.js is off.
if (typeof window !== 'undefined') {
  throw new Error('lib/departmentPrices.js must only be used on the server.');
}

import { fetchTeracomAiPrices } from './api/teracomAiPrices.js';
import { PRICES_PUBLISHED } from './savings.js';

const BUNDLED = {
  'base-platform': 39,
  'technical-support': 159,
  marketing: 129,
  finance: 99,
  operations: 99,
  projects: 99,
  sales: 99,
  service: 99,
  'executive-leadership': 79,
  hr: 79,
  'legal-compliance': 79,
  'analytics-and-reporting': 49,
  consulting: 49,
  'facilities-and-fleet': 49,
  procurement: 49,
  'work-health-and-safety': 49,
  'customer-success': 39,
  cybersecurity: 39,
  it: 39,
  personal: 49,
  'cyber-protection': 59,
  'electronic-security-extension': 29,
};

/** The prices for a page, or null while they are not published. */
export async function publishedPrices() {
  if (!PRICES_PUBLISHED) return null;
  try {
    const live = await fetchTeracomAiPrices();
    if (live && Object.keys(live).length > 0) return { ...live };
  } catch (error) {
    console.warn('Teracom AI prices not read from the backend; using the bundled copy.', error instanceof Error ? error.message : error);
  }
  return { ...BUNDLED };
}
