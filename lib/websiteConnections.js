// Server-only. The connections whose keys live in the website's own Vercel
// settings rather than the backend: Stripe, Cloudflare Turnstile, Google
// Analytics and this deployment. They are listed beside the backend's on
// Admin -> Connections; keys are changed in Vercel, never shown here.
if (typeof window !== 'undefined') {
  throw new Error('lib/websiteConnections.js must only be used on the server.');
}

import { GA_MEASUREMENT_ID } from '@/lib/analytics';
import { turnstileConfigured } from '@/lib/turnstile';

const TIMEOUT_MS = 15000;
const VERCEL_SETTINGS = 'Vercel: teracom-solutions-website, Settings, Environment Variables';
// Cloudflare's documented dummy response: a real secret answers
// invalid-input-response, a wrong one invalid-input-secret.
const DUMMY_TURNSTILE_RESPONSE = 'XXXX.DUMMY.TOKEN.XXXX';

export const WEBSITE_TESTS = ['stripe', 'turnstile'];

function entry(key, name, group, purpose, status, detail, extra = {}) {
  return {
    key, name, group, purpose, status, detail,
    checked_at: null, manage_href: null, editable: false, fields: [], can_test: false,
    held_by: VERCEL_SETTINGS, ...extra,
  };
}

function stripeMode(key) {
  if (key.startsWith('sk_live_') || key.startsWith('rk_live_')) return 'live';
  if (key.startsWith('sk_test_') || key.startsWith('rk_test_')) return 'test';
  return 'unknown';
}

export function websiteConnections() {
  const out = [];

  const stripeKey = process.env.STRIPE_SECRET_KEY || '';
  if (!stripeKey) {
    out.push(entry('stripe', 'Stripe', 'Accounts and payments', 'Card payments at checkout.', 'not_set_up', 'No Stripe secret key is set.'));
  } else {
    const parts = [`${stripeMode(stripeKey) === 'live' ? 'Live' : 'Test'} key ending ${stripeKey.slice(-4)}`];
    parts.push(process.env.STRIPE_WEBHOOK_SECRET ? 'webhook signing secret set' : 'no webhook signing secret, so paid orders are not confirmed');
    parts.push(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'publishable key set' : 'no publishable key');
    out.push(entry('stripe', 'Stripe', 'Accounts and payments', 'Card payments at checkout.',
      process.env.STRIPE_WEBHOOK_SECRET && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'unknown' : 'attention',
      `${parts.join('; ')}.`, { can_test: true }));
  }

  out.push(turnstileConfigured()
    ? entry('turnstile', 'Cloudflare Turnstile', 'Hosting and network', 'The spam check on the website forms.', 'unknown',
      'Site key and secret key set.', { can_test: true })
    : entry('turnstile', 'Cloudflare Turnstile', 'Hosting and network', 'The spam check on the website forms.', 'not_set_up',
      'Not set, so the forms rely on their own spam guard.'));

  out.push(entry('analytics', 'Google Analytics', 'Marketing', 'Visitor statistics in Google Analytics and Search Console.',
    GA_MEASUREMENT_ID ? 'set_up' : 'not_set_up',
    GA_MEASUREMENT_ID ? `Measurement ID ${GA_MEASUREMENT_ID}. Google shows the figures; the console's Website Data page has our own.` : 'No measurement ID.'));

  const env = process.env.VERCEL_ENV || '';
  const commit = (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7);
  // The commit message's first line (/$/m splits at the first line end).
  const message = (process.env.VERCEL_GIT_COMMIT_MESSAGE || '').split(/$/m)[0];
  out.push(entry('deployment', 'This website deployment', 'Hosting and network', 'The copy of the website serving this page.',
    env ? 'connected' : 'set_up',
    env ? `Vercel ${env}${commit ? `, commit ${commit}` : ''}${message ? `: ${message}` : ''}.` : 'Running outside Vercel.'));

  return out;
}

async function getJson(url, init) {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS), cache: 'no-store' });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

async function testStripe() {
  const key = process.env.STRIPE_SECRET_KEY || '';
  if (!key) return { status: 'not_set_up', detail: 'No Stripe secret key is set.' };
  const headers = { Authorization: `Bearer ${key}` };
  const balance = await getJson('https://api.stripe.com/v1/balance', { headers });
  if (!balance.ok) {
    return { status: 'failing', detail: `Stripe: ${balance.data?.error?.message || `answered ${balance.status}`}` };
  }
  const mode = balance.data.livemode ? 'live' : 'test';
  const hooks = await getJson('https://api.stripe.com/v1/webhook_endpoints?limit=20', { headers });
  if (!hooks.ok) {
    return { status: 'attention', detail: `Stripe answers in ${mode} mode, but its webhooks could not be read: ${hooks.data?.error?.message || hooks.status}.` };
  }
  const ours = (hooks.data.data || []).filter((hook) => String(hook.url || '').includes('/api/webhooks/stripe'));
  if (!ours.length) {
    return { status: 'attention', detail: `Stripe answers in ${mode} mode, but no webhook points at /api/webhooks/stripe, so paid orders are not confirmed.` };
  }
  const enabled = ours.filter((hook) => hook.status === 'enabled');
  if (!enabled.length) {
    return { status: 'failing', detail: `Stripe answers in ${mode} mode, but the website's webhook is disabled.` };
  }
  return {
    status: mode === 'live' ? 'connected' : 'attention',
    detail: `Stripe answers in ${mode} mode; webhook to ${enabled[0].url} is enabled.${mode === 'live' ? '' : ' Test mode takes no real payments.'}`,
  };
}

async function testTurnstile() {
  if (!turnstileConfigured()) return { status: 'not_set_up', detail: 'Not set, so the forms rely on their own spam guard.' };
  const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: DUMMY_TURNSTILE_RESPONSE });
  const result = await getJson('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const codes = result.data?.['error-codes'] || [];
  if (codes.includes('invalid-input-secret') || codes.includes('missing-input-secret')) {
    return { status: 'failing', detail: 'Cloudflare does not accept the Turnstile secret key.' };
  }
  if (!result.ok) return { status: 'failing', detail: `Cloudflare answered ${result.status}.` };
  return { status: 'connected', detail: 'Cloudflare accepts the Turnstile secret key.' };
}

export async function testWebsiteConnection(key) {
  let result;
  try {
    result = key === 'stripe' ? await testStripe() : await testTurnstile();
  } catch (err) {
    result = { status: 'failing', detail: `Could not reach ${key === 'stripe' ? 'Stripe' : 'Cloudflare'} (${err?.name || 'error'}).` };
  }
  return { key, ...result, checked_at: new Date().toISOString() };
}