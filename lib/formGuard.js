// Spam guard for the public forms. Works without any keys, next to the
// Cloudflare Turnstile check in lib/turnstile.js, and catches the kind of
// submissions that actually arrived (Robert, 2026-09-28):
//   - a hidden field a person never sees and a form-filling bot always fills;
//   - a minimum time between the form appearing and it being sent, and no
//     time at all when a bot posts straight at the endpoint;
//   - obvious link spam: HTML or BBCode, link shorteners, a pile of links,
//     and a short list of lead-list and SEO sales phrases.
// Pure: no React, no Next, so the plain Node test runner can load it.

export const TRAP_FIELD = 'website_url';
export const STARTED_FIELD = 'form_started';
export const MIN_FILL_MS = 3000;
const FUTURE_SLACK_MS = 60_000;
const MAX_LINKS = 3;

const MARKUP = [
  /<\s*\/?\s*(a|b|i|u|strong|em|img|iframe|script|div|span|p|br|font|h[1-6])\b[^>]*>/i,
  /\[url[=\]]/i,
  /href\s*=/i,
];
const SHORTENERS = /(?:^|[^a-z0-9-])(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly|rb\.gy|ow\.ly|shorturl\.at|tiny\.cc|buff\.ly|rebrand\.ly|s\.id)\//i;
const LINK = /\bhttps?:\/\/[^\s<>"']+|\bwww\.[^\s<>"']+/gi;
const PHRASES = /\b(?:b2b data|email list|mailing list|backlinks|guest post|seo services|casino|viagra|cialis)\b/i;
const LINK_IN_NAME = /https?:|www\.|\/\//i;

function strings(values) {
  return (values || []).filter((v) => typeof v === 'string' && v.trim());
}

export function spamReasonsForText(texts) {
  const list = strings(texts);
  const reasons = [];
  if (list.some((t) => MARKUP.some((re) => re.test(t)))) reasons.push('markup');
  if (list.some((t) => SHORTENERS.test(t))) reasons.push('shortener');
  const links = list.reduce((n, t) => n + (t.match(LINK) || []).length, 0);
  if (links > MAX_LINKS) reasons.push('links');
  if (list.some((t) => PHRASES.test(t))) reasons.push('phrase');
  return reasons;
}

export function checkSubmission({ trap, started, texts = [], names = [], now = Date.now() } = {}) {
  const reasons = [];
  if (typeof trap === 'string' && trap.trim()) reasons.push('trap');
  const startedAt = typeof started === 'string' && started.trim() ? Number(started) : started;
  if (typeof startedAt !== 'number' || !Number.isFinite(startedAt) || startedAt <= 0) {
    reasons.push('no-timer');
  } else if (startedAt - now > FUTURE_SLACK_MS) {
    reasons.push('bad-timer');
  } else if (now - startedAt < MIN_FILL_MS) {
    reasons.push('too-fast');
  }
  if (strings(names).some((n) => LINK_IN_NAME.test(n))) reasons.push('link-in-name');
  reasons.push(...spamReasonsForText(texts));
  return { spam: reasons.length > 0, reasons };
}

// Every string in a flat object of form values (the request forms).
export function textValues(values) {
  return Object.values(values || {}).filter((v) => typeof v === 'string');
}
