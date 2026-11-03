// Server-only. The provisional Department prices (teracom-ai-docs
// Reports/DEPARTMENT_PRICING_MODEL_2026-11-03.md, version 2): A$ a month, ex GST, one
// price per Department. NOT published: pages only receive them when PRICES_PUBLISHED in
// lib/savings.js is switched on after Robert approves. Kept out of every client file,
// so the numbers are never in a page's source while they are hidden.
if (typeof window !== 'undefined') {
  throw new Error('lib/departmentPrices.js must only be used on the server.');
}

import { PRICES_PUBLISHED } from './savings.js';

const PROVISIONAL = {
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
export function publishedPrices() {
  return PRICES_PUBLISHED ? { ...PROVISIONAL } : null;
}
