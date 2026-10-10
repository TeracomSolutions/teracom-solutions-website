// The pure parts of the Search page's Overview, Opportunities, Titles and
// Indexing tabs (Robert, 2026-10-10): what Google's words mean in plain
// English, how the numbers are shown, and the sentences about the trend.
import { formatDateTime } from './adminFormat.js';

export const KIND_LABELS = {
  product: 'Product',
  category: 'Category',
  brand: 'Brand',
  article: 'Article',
  resource: 'Resources',
  service: 'Service',
  tool: 'Tool',
  home: 'Home',
  other: 'Other',
};

// What each state of a page means, and what to do about it.
export const GROUP_INFO = {
  indexed: { label: 'In Google', help: 'Google has this page and can show it in search results.' },
  waiting: {
    label: 'Seen, not added',
    help: 'Google has found the page but chose not to add it yet. Thin pages (no photo, little text) often wait here: give the page a photo and a real description, and link to it from other pages.',
  },
  duplicate: { label: 'Duplicate', help: 'Google thinks this page is a copy of another and shows the other one. Check the page has its own address (canonical) set correctly.' },
  excluded: { label: 'Left out', help: 'The page is kept out of Google on purpose (a noindex tag or robots.txt). Fine for thin pages, but check it is meant to be.' },
  redirect: { label: 'Moved', help: 'The address sends visitors to another page.' },
  problem: { label: 'Problem', help: 'Google could not use this page (not found, a server error or access refused). Open the page and see what it does.' },
  unknown: {
    label: 'Not found by Google',
    help: 'Google does not know this address yet. Listing it in the sitemap and linking to it from other pages helps Google find it.',
  },
  unchecked: { label: 'Not checked yet', help: 'This page has not been checked with Google yet. Pages are checked a few thousand a day.' },
};

export const GROUP_ORDER = ['indexed', 'waiting', 'unknown', 'problem', 'duplicate', 'excluded', 'redirect', 'unchecked'];

export function groupLabel(group) {
  return (GROUP_INFO[group] || {}).label || group;
}

// The help for a state, with a pointer to Photos & text for a product page that is waiting or unknown.
export function groupHelp(group, kind) {
  const info = GROUP_INFO[group];
  if (!info) return '';
  if (kind === 'product' && (group === 'waiting' || group === 'unknown')) {
    return `${info.help} For a product, use Find photos and text to add the picture and description Google wants.`;
  }
  return info.help;
}

export const OPPORTUNITY_TABS = [
  { key: 'striking', label: 'One push from page one', help: 'Searches where a page sits at position 4 to 20. The extra clicks are what it would earn at position 3.' },
  { key: 'ctr', label: 'Shown but not clicked', help: 'Pages Google shows often that few people click. A better title and description may earn more clicks.' },
  { key: 'gaps', label: 'Weak or missing pages', help: 'Searches people make where the site only shows at position 20 or lower. A page or article for it may be missing.' },
  { key: 'rising', label: 'Rising searches', help: 'Searches shown more in the last 28 days than the 28 before.' },
  { key: 'falling', label: 'Falling searches', help: 'Searches shown less in the last 28 days than the 28 before.' },
];

export function countFor(counts, key) {
  if (!counts) return '';
  return ` (${Number(counts[key]) || 0})`;
}

export function formatNumber(value) {
  return (Number(value) || 0).toLocaleString('en-AU');
}

// 0.0145 as "1.4%".
export function percentText(share) {
  const value = Number(share);
  if (!Number.isFinite(value)) return '—';
  return `${(value * 100).toLocaleString('en-AU', { maximumFractionDigits: 1 })}%`;
}

export function positionText(position) {
  const value = Number(position);
  return Number.isFinite(value) && value > 0 ? value.toLocaleString('en-AU', { maximumFractionDigits: 1 }) : '—';
}

// "+12%" or "-40%" against the period before; "new" when there was nothing before.
export function changeText(now, before) {
  const a = Number(now) || 0;
  const b = Number(before) || 0;
  if (!b) return a ? 'new' : '—';
  const change = Math.round(((a - b) / b) * 100);
  return `${change > 0 ? '+' : ''}${change}%`;
}

// "About 10 more clicks a month".
export function gainText(gain) {
  const value = Number(gain) || 0;
  if (value < 0.5) return 'under 1 more click a month';
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return `about ${rounded.toLocaleString('en-AU')} more ${rounded === 1 ? 'click' : 'clicks'} a month`;
}

// The weekly totals as a label and a value for each bar.
export function weekBars(weeks, field) {
  return (Array.isArray(weeks) ? weeks : []).map((week) => ({ date: week.week, [field]: Number(week[field]) || 0 }));
}

function weekName(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

// One or two sentences about where Google views have been heading. The last
// week is left out when it is the current, part-finished week.
export function trendSentence(weeks) {
  const list = (Array.isArray(weeks) ? weeks : []).filter((week) => week && Number.isFinite(Number(week.impressions)));
  if (list.length < 3) return '';
  const settled = list.slice(0, -1);
  const peak = settled.reduce((best, week) => (week.impressions > best.impressions ? week : best), settled[0]);
  const latest = settled[settled.length - 1];
  if (!peak.impressions) return '';
  const drop = Math.round((1 - latest.impressions / peak.impressions) * 100);
  if (drop >= 30) {
    return `Google showed the site ${formatNumber(peak.impressions)} times in the week of ${weekName(peak.week)} and ${formatNumber(latest.impressions)} times in the week of ${weekName(latest.week)}, ${drop}% fewer. Redirecting the old addresses and fixing the pages below is how it comes back.`;
  }
  if (latest.impressions > peak.impressions * 0.9) {
    return `Google showed the site ${formatNumber(latest.impressions)} times in the week of ${weekName(latest.week)}, at or near its best in this period.`;
  }
  return `Google showed the site ${formatNumber(latest.impressions)} times in the week of ${weekName(latest.week)}, ${drop}% below the best week (${formatNumber(peak.impressions)}).`;
}

// The line about a background job: "Updated 10 Oct 2026, 11:20 am", "Updating now", or the error.
export function jobText(status, what = 'Updated') {
  if (!status) return '';
  if (status.running) return 'Working on it now. Press Reload to see the result.';
  if (status.error) return `The last attempt stopped: ${status.error}`;
  if (!status.last_at) return 'Not run yet.';
  return `${what} ${formatDateTime(status.last_at)}.`;
}

// A title or description length against what Google shows (about 60 and 155 characters).
export function lengthNote(text, limit) {
  const length = String(text || '').length;
  return { length, tooLong: length > limit, text: `${length} of about ${limit} characters` };
}

export function titleStatusLabel(status) {
  if (status === 'active') return 'Title live';
  if (status === 'proposed') return 'Suggestion waiting';
  return '';
}

// What the page says after Find photos and text on pages.
export function queueNotice(result) {
  const queued = Number(result?.queued) || 0;
  const notProducts = Number(result?.not_products) || 0;
  const ready = Number(result?.ready) || 0;
  const already = Number(result?.already) || 0;
  const parts = [];
  if (queued) parts.push(`${queued} ${queued === 1 ? 'product is' : 'products are'} being looked up on the manufacturers' websites.`);
  if (already) parts.push(`${already} ${already === 1 ? 'was' : 'were'} already waiting.`);
  if (ready) parts.push(`${ready} already ${ready === 1 ? 'has' : 'have'} a photo and description.`);
  if (notProducts) parts.push(`${notProducts} ${notProducts === 1 ? 'page is' : 'pages are'} not a product page.`);
  return parts.length ? parts.join(' ') : 'Nothing to look up.';
}

export function sitemapLine(sitemap) {
  const parts = [`${formatNumber(sitemap.submitted)} addresses listed`];
  if (sitemap.last_downloaded) parts.push(`read by Google ${formatDateTime(sitemap.last_downloaded)}`);
  if (sitemap.errors) parts.push(`${sitemap.errors} ${sitemap.errors === 1 ? 'error' : 'errors'}`);
  if (sitemap.warnings) parts.push(`${sitemap.warnings} ${sitemap.warnings === 1 ? 'warning' : 'warnings'}`);
  return parts.join(', ');
}

// An address cut to fit a table cell.
export function shortPath(path, max = 60) {
  const text = String(path || '');
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
