// Server-only. What the growth tools publish on the website (Robert,
// 2026-11-05): area pages, projects and answered questions, and whether a
// public-facing tool is switched on. Nothing shows while a tool is off.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/growthPublic.js must only be used on the server.');
}

import { BACKEND_API_URL } from '../config.js';

const FRESH_SECONDS = 300;

export async function growthOn(tool) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/public/growth/on/${tool}`, { next: { revalidate: FRESH_SECONDS, tags: ['growth'] } });
    if (!response.ok) return false;
    return Boolean((await response.json()).on);
  } catch {
    return false;
  }
}

export async function publishedItems(tool) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/public/growth/${tool}/items`, { next: { revalidate: FRESH_SECONDS, tags: ['growth'] } });
    if (!response.ok) return [];
    return (await response.json()).items || [];
  } catch {
    return [];
  }
}

export async function publishedItem(tool, slug) {
  return (await publishedItems(tool)).find((item) => item.slug === slug) || null;
}

// A page's text: paragraphs separated by blank lines.
export function paragraphs(text) {
  return String(text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}
