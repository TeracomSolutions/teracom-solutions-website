// Server-only. Commerce-to-Licensing Lifecycle Automation, Phase 1 (Wave 2
// Workstream 5) — the one caller of teracom-solutions-website-backend's
// internal /internal/licence-billing-references/* endpoints (that backend
// forwards on to teracom-ai-platform-backend, the real data owner, using
// its own distinct WEBSITE_BACKEND_SERVICE_TOKEN — see that repo's
// api/licence_billing_references.py), itself only called from
// app/api/webhooks/stripe/route.js. Deliberately its own module, not folded
// into lib/api/licensing.js: that module's calls all carry a real customer
// session token (see lib/api/auth.js#getSessionToken), which does not exist
// on a Stripe webhook's call path — this one instead sends this frontend's
// own distinct WEBSITE_FRONTEND_SERVICE_TOKEN secret via a custom header
// (RISK-003 — no longer a secret shared verbatim across every backend in
// the estate).
if (typeof window !== 'undefined') {
  throw new Error('lib/api/commerceLicensing.js must only be used on the server.');
}

import { backendFetch } from './client.js';

function serviceHeaders() {
  return { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' };
}

/**
 * Idempotent upsert — safe to call again for the same licenceId on a later
 * webhook event (e.g. a subscription renewal after the initial checkout).
 * Callers should treat a rejected promise as best-effort-failed: never let
 * this block the Zoho sync or cause Stripe to retry the whole webhook.
 */
export async function linkLicenceBillingReference({
  licenceId,
  externalBillingProvider,
  externalCustomerId,
  externalSubscriptionId,
  externalInvoiceReference,
}) {
  return backendFetch('/internal/licence-billing-references/link', {
    method: 'POST',
    headers: serviceHeaders(),
    body: {
      licence_id: licenceId,
      external_billing_provider: externalBillingProvider,
      external_customer_id: externalCustomerId,
      external_subscription_id: externalSubscriptionId ?? null,
      external_invoice_reference: externalInvoiceReference ?? null,
    },
  });
}
