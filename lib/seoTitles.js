// Page titles and descriptions approved on the console's Search page (Robert,
// 2026-10-10). The backend keeps the live ones (api/staff_seo_insights.py); a
// page's metadata asks here whether its address has one, and uses it in place
// of the title and description the page was built with. The list is kept for
// five minutes; when the backend cannot be reached the pages keep their own.
import { BACKEND_API_URL } from './config.js';
import { redirectKey } from './seoRedirects.js';

const FRESH_MS = 5 * 60 * 1000;
const RETRY_MS = 30 * 1000;
const TIMEOUT_MS = 2000;

let kept = { at: 0, titles: {} };

// A page's metadata with the approved title and description laid over it.
// entry is { title, description } or nothing.
export function applyTitle(metadata, entry) {
  if (!entry || !entry.title) return metadata;
  const changes = { title: entry.title };
  if (entry.description) changes.description = entry.description;
  return {
    ...metadata,
    ...changes,
    openGraph: { ...(metadata && metadata.openGraph), ...changes },
    twitter: { ...(metadata && metadata.twitter), ...changes },
  };
}

export async function loadTitles(now = Date.now()) {
  if (now - kept.at < FRESH_MS) return kept.titles;
  const token = process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '';
  if (!token) return kept.titles;
  try {
    const response = await fetch(`${BACKEND_API_URL}/internal/seo/titles`, {
      headers: { 'X-Internal-Service-Token': token, Accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: 300 },
    });
    if (!response.ok) throw new Error(`titles ${response.status}`);
    const data = await response.json();
    kept = { at: now, titles: data.titles && typeof data.titles === 'object' ? data.titles : {} };
  } catch {
    kept = { at: now - FRESH_MS + RETRY_MS, titles: kept.titles };
  }
  return kept.titles;
}

// Used in a page's generateMetadata: return withSeoTitle(pageMetadata({...}), path).
export async function withSeoTitle(metadata, path, load = loadTitles) {
  const titles = await load();
  return applyTitle(metadata, titles[redirectKey(path)]);
}
