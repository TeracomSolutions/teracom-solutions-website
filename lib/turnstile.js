// Cloudflare Turnstile.
//
// The widget on the page is decoration on its own -- a bot posts straight at
// the endpoint and never loads it. What actually protects a form is this
// check, run in the handler before anything is accepted or written.
//
// The site key is public and lives in the page source. The secret is a Vercel
// environment variable and must never reach the repo.

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TIMEOUT_MS = 8000;

/**
 * Configured means enforced. Unconfigured means off, not silently
 * allowed-through-with-a-widget.
 *
 * Read from process.env each time rather than from the module constant
 * above: that constant is inlined at build time for the browser bundle,
 * which is right for the widget and wrong for a server-side check that
 * should reflect the environment it is actually running in.
 */
export function turnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

/**
 * Check a widget token with Cloudflare.
 *
 * Fails CLOSED: a network error, a timeout or a malformed response rejects
 * the submission rather than waving it through, because "Cloudflare was
 * briefly unreachable" is exactly the state a flood would create.
 *
 * The one exception is when Turnstile is not configured at all, which is a
 * deliberate off switch rather than a failure -- otherwise every form on the
 * site would stop working the moment this shipped and before the keys were
 * set.
 */
export async function verifyTurnstile(token, remoteIp) {
  if (!turnstileConfigured()) return { ok: true, skipped: true };

  if (!token || typeof token !== 'string') {
    return { ok: false, reason: 'missing', retryable: true };
  }

  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY,
    response: token,
  });
  // Helps Cloudflare score the request; harmless when absent.
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!response.ok) {
      return { ok: false, reason: `http_${response.status}`, retryable: true };
    }
    const result = await response.json();
    if (result.success) return { ok: true };
    return { ok: false, reason: (result['error-codes'] || []).join(',') || 'rejected', retryable: true };
  } catch (error) {
    return { ok: false, reason: 'unreachable', retryable: true };
  }
}

/**
 * What a blocked human is told.
 *
 * Never a dead end. Someone turned away from the account application or the
 * monitoring application is someone who cannot accept terms online, so the
 * message has to hand them a way to reach a person.
 */
export const TURNSTILE_FAILED_MESSAGE =
  'We could not confirm you are human. Please try once more, and if it happens again email support@teracomsolutions.com.au and we will take your details that way.';
