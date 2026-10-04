import { z } from 'zod';

// Teach Tera on the console's Support page: what staff send to teach Tera a
// fact (api/support.py FactRequest on the backend), and the list of
// manufacturers' websites Tera may read.
export const FactRequest = z.object({
  question: z.string().trim().min(3).max(500),
  answer: z.string().trim().min(1).max(4000),
  active: z.boolean().default(true),
});

export const FACT_ERROR = 'Write a question of 3 to 500 characters and an answer of up to 4,000.';

// "hikvision.com, https://www.axis.com" or one per line, as site names.
// Anything without a dot (a stray "https" or "au") is dropped.
export function splitSites(text) {
  const sites = [];
  for (const part of String(text || '').toLowerCase().split(/[^a-z0-9.-]+/)) {
    const site = part.replace(/^www[.]/, '').replace(/^[.]+|[.]+$/g, '');
    if (site.includes('.') && !sites.includes(site)) sites.push(site);
  }
  return sites;
}