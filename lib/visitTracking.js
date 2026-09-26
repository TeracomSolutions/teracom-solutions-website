// Pure helpers for the first-party visit beacon, kept free of Next imports
// so they run under `node --test`.
import { createHash } from 'node:crypto';

const BOT_PATTERN = /bot|crawl|spider|slurp|headless|lighthouse|pingdom|uptime|monitor|preview|facebookexternalhit|vercel-screenshot|python-requests|curl\/|wget\//i;

// Paths that are not a visitor reading the site.
export function isTrackablePath(path) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.length > 500) return false;
  if (path.startsWith('/admin') || path.startsWith('/api/') || path.startsWith('/_next')) return false;
  if (/\.(png|jpe?g|webp|svg|ico|css|js|map|txt|xml|json|woff2?)$/i.test(path)) return false;
  return true;
}

export function isBot(userAgent) {
  if (!userAgent) return true;
  return BOT_PATTERN.test(userAgent);
}

export function deviceFromUserAgent(userAgent = '') {
  if (/iPad|Tablet|PlayBook|Silk/i.test(userAgent) || (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent))) return 'tablet';
  if (/Mobi|iPhone|Android|IEMobile|Opera Mini/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

// The host of the page the visitor came from, or null for direct traffic
// and for our own pages.
export function referrerHost(referrer, ownHost) {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '').toLowerCase();
    if (!host || (ownHost && host === ownHost.replace(/^www\./, '').toLowerCase())) return null;
    return host.slice(0, 255);
  } catch {
    return null;
  }
}

// One-way, salted per day: the same person counts once a day and cannot
// be identified from the row. `day` is the Sydney date string.
export function visitorHash({ ip, userAgent, day, salt }) {
  return createHash('sha256').update(`${salt}|${day}|${ip || ''}|${userAgent || ''}`).digest('hex');
}

export function sydneyDay(now = new Date()) {
  return new Date(now.getTime() + 10 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
