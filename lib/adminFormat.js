// Display formatting for the admin pages, server or client.
//
// Copied from the the previous platform's lib/format.js. Dates always render in
// one explicit zone: Vercel runs in UTC, so a date formatted without a zone
// comes out 10-11 hours off, and a client component formatted on both sides
// would produce different text on the server than in the browser (React
// hydration errors). The zone is the one chosen under Connections > Time
// (Robert, 2026-11-07); AdminShell passes it to AdminZoneSetter, which calls
// setAdminZone before the page content renders, on the server and in the browser.
// Times that show a clock time also show the zone's name (AEDT, AWST and so on).

const LOCALE = 'en-AU';
const DEFAULT_ZONE = 'Australia/Melbourne';
let TIME_ZONE = DEFAULT_ZONE;

export function setAdminZone(zone) {
  if (typeof zone !== 'string' || !zone) return;
  try {
    new Intl.DateTimeFormat(LOCALE, { timeZone: zone });
    TIME_ZONE = zone;
  } catch {
    TIME_ZONE = DEFAULT_ZONE;
  }
}

export function adminZone() {
  return TIME_ZONE;
}

function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// "21 Sept 2026"
export function formatDate(value, fallback = '—') {
  const date = toDate(value);
  if (!date) return fallback;
  return date.toLocaleDateString(LOCALE, { year: 'numeric', month: 'short', day: 'numeric', timeZone: TIME_ZONE });
}

// "21 Sept 2026, 10:35 pm AEST"
export function formatDateTime(value, fallback = '—') {
  const date = toDate(value);
  if (!date) return fallback;
  return date.toLocaleString(LOCALE, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: TIME_ZONE, timeZoneName: 'short',
  });
}

// Stored codes whose plain-English wording isn't just "underscores to
// spaces, capitalise the first letter".
const LABELS = {
  platform_admin: 'Platform admin',
  licensing_approver: 'Licensing approver',
  ai: 'AI',
  csv: 'CSV',
  openai: 'OpenAI',
};

// Turns a stored code ("needs_review", "website_intelligence") into the
// words staff should see. Unknown codes still read cleanly.
export function humanise(value, fallback = '—') {
  if (value === null || value === undefined || value === '') return fallback;
  const key = String(value);
  if (LABELS[key]) return LABELS[key];
  const words = key.replace(/[_-]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// The contact form's own <select> options, as the backend stores them.
export const INQUIRY_LABELS = {
  contact_sales: 'Contact sales',
  demo_request: 'Demo request',
  trial_question: 'Trial question',
  platform_question: 'Platform question',
  partnership: 'Partnership',
  technical_consulting: 'Technical consulting',
  securityos: 'Teracom AI',
  store: 'Store',
  service_request: 'Service request',
  password_reset: 'Password reset',
  account_application: 'Account application',
  tera_question: 'Ask Tera question',
  callback: 'Callback request',
};

export function inquiryLabel(value) {
  return INQUIRY_LABELS[value] || humanise(value);
}
