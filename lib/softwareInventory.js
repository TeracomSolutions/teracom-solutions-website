// Connections > Software (Robert, 2026-11-01): what the website runs, at what version, whether a newer release
// exists and whether a security advisory has been published for it. Pure helpers, so the Node test runner can
// load them; app/api/admin/software/route.js does the fetching.

// What the website's main packages are for, in plain words.
export const WEBSITE_PURPOSE = {
  next: 'The website and console framework (Next.js).',
  react: 'Builds every page on screen.',
  'react-dom': 'Puts React pages into the browser.',
  stripe: 'Card payments at checkout (server side).',
  '@stripe/stripe-js': 'The Stripe payment form in the browser.',
  '@stripe/react-stripe-js': 'The Stripe payment form for React.',
  sharp: 'Resizes and compresses images.',
  zod: 'Checks everything sent to the website’s own API.',
  'lucide-react': 'The icons.',
  typescript: 'Type checking while the site is built.',
  '@types/node': 'Type information for Node, used while building.',
  '@types/react': 'Type information for React, used while building.',
};

// The version a package.json range points at: ^1.2.3 and ~1.2.3 become 1.2.3.
export function baseVersion(range) {
  const match = String(range || '').match(/(\d+)\.(\d+)\.(\d+)/);
  return match ? `${match[1]}.${match[2]}.${match[3]}` : null;
}

function parts(version) {
  return String(version || '').split(/[.+-]/).slice(0, 3).map((p) => Number.parseInt(p, 10) || 0);
}

// True when latest is a higher version than running (by major, minor, patch).
export function isNewer(latest, running) {
  if (!latest || !running) return false;
  const a = parts(latest);
  const b = parts(running);
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return false;
}

// advisory, update, current or unknown: the same order the backend uses.
export function statusOf(item) {
  if (item.advisories && item.advisories.length) return 'advisory';
  if (!item.running) return 'unknown';
  if (!item.latest) return item.kind === 'package' ? 'unknown' : 'current';
  return isNewer(item.latest, item.running) ? 'update' : 'current';
}

export function summaryOf(items) {
  const counts = { current: 0, update: 0, advisory: 0, unknown: 0 };
  for (const item of items || []) counts[item.status] = (counts[item.status] || 0) + 1;
  return counts;
}

export const STATUS_LABEL = {
  current: 'Up to date',
  update: 'Newer version available',
  advisory: 'Security advisory',
  unknown: 'Could not check',
};
