import { formatNumber } from './searchInsights.js';

// Words for the Search page's Health tab (Robert, 2026-10-10): the weekly
// check of the website itself. The backend names each kind of problem and says
// what to do about it (services/site_health.py); this holds the rest.

export const SEVERITY_LABELS = {
  problem: 'Problem',
  warning: 'To improve',
  note: 'For information',
};

// The kinds of problem the Titles tab can fix.
export const TITLE_CODES = [
  'no_title',
  'title_short',
  'title_long',
  'title_duplicate',
  'no_description',
  'description_short',
  'description_long',
  'description_duplicate',
];

export function speedText(ms) {
  const value = Number(ms);
  if (!Number.isFinite(value) || value <= 0) return '—';
  const rounded = Math.round(value);
  return rounded < 1000 ? `${rounded} ms` : `${(value / 1000).toFixed(1)} s`;
}

// True when one of the page's problems is a title or description problem.
export function needsTitle(issues) {
  return (issues || []).some((issue) => TITLE_CODES.includes(issue.code));
}

// The problems of one page, worst first.
export function sortIssues(issues) {
  const rank = { problem: 0, warning: 1, note: 2 };
  return [...(issues || [])].sort((a, b) => (rank[a.severity] ?? 3) - (rank[b.severity] ?? 3));
}

// What the last check found about the site as a whole, in a sentence or two.
export function siteLine(summary) {
  if (!summary || typeof summary !== 'object') return '';
  const parts = [];
  if (summary.robots_ok === false) parts.push('robots.txt does not answer.');
  if (summary.sitemap_ok === false) parts.push('The sitemap does not answer.');
  if (summary.robots_ok !== false && summary.sitemap_ok !== false && summary.sitemap_pages) {
    parts.push(`robots.txt and the sitemap answer, and the sitemap lists ${formatNumber(summary.sitemap_pages)} pages.`);
  }
  if (summary.median_ms) {
    parts.push(`A typical page loads in ${speedText(summary.median_ms)}; 95 in 100 load within ${speedText(summary.p95_ms)}.`);
  }
  return parts.join(' ');
}

export function checkNotice(result) {
  if (result && result.started) return 'Checking every page of the website now. This takes about ten minutes; the list updates by itself.';
  return (result && result.detail) || 'Nothing started.';
}

// The suggestion for a page is kept on the Titles tab.
export function suggestNotice(path) {
  return `A new title and description for ${path} is waiting on the Titles tab for your yes.`;
}
