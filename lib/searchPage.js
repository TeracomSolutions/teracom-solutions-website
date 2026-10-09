// The pure parts of the Search page (Robert, 2026-10-09): old addresses that
// Google still shows people, where each goes now, and what staff say yes or
// no to. The list is kept by the backend (api/staff_seo.py).
import { formatDateTime } from './adminFormat.js';
import { isSafeTarget } from './seoRedirects.js';

export const VIEWS = [
  { key: 'proposed', label: 'Waiting for a yes' },
  { key: 'active', label: 'Live' },
  { key: 'rejected', label: 'Rejected' },
];

// How sure a guess is. The first three go live by themselves.
export const CONFIDENCE_LABELS = {
  exact: 'Sure',
  strong: 'Strong guess',
  brand: 'Brand page',
  likely: 'Possible',
  weak: 'General page',
};

export function confidenceLabel(confidence) {
  return CONFIDENCE_LABELS[confidence] || '';
}

// The number beside a tab.
export function countFor(counts, key) {
  if (!counts) return '';
  return ` (${Number(counts[key]) || 0})`;
}

function plural(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}

// What a row says about how often Google showed it.
export function shownText(row) {
  const views = Number(row?.impressions) || 0;
  const clicks = Number(row?.clicks) || 0;
  return `${plural(views, 'view', 'views')}, ${plural(clicks, 'click', 'clicks')}`;
}

// A new address staff type: a page on this site.
export function validTarget(text) {
  return isSafeTarget(String(text || '').trim());
}

// The line under the buttons about the last search.
export function syncNotice(sync) {
  if (!sync) return '';
  if (sync.running) return 'Searching now. This takes a few minutes; press Refresh to see what it has found.';
  if (sync.error) return `The last search stopped: ${sync.error}`;
  if (!sync.last_sync_at) return 'No search has run yet.';
  const found = sync.summary || {};
  const pages = Number(found.pages) || 0;
  const dead = Number(found.dead) || 0;
  return `Last search ${formatDateTime(sync.last_sync_at)}: Google showed ${plural(pages, 'page', 'pages')} and ${dead} of them no longer exist on the website.`;
}

// What the page says after Search now.
export function startNotice(result) {
  if (result?.started) return 'Search started. It asks Google which pages it shows, checks each one and works out where the old ones belong.';
  return result?.detail || 'Nothing started.';
}

// What the page says after a yes or a no.
export function decideNotice(done, action) {
  const count = plural(Number(done) || 0, 'redirect', 'redirects');
  return action === 'approve' ? `${count} turned on.` : `${count} set aside.`;
}