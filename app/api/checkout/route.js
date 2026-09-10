import { NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { findProduct } from '@/lib/products';
import { SITE_URL } from '@/lib/config';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';

// Card-testing defence: an unauthenticated endpoint that creates a real
// Stripe Checkout Session is a standard target for automated card-testing
// fraud once this is public (flagged in Repository_Audit_Decision_Memo_V1.md
// item 6). A generous-but-real per-IP limit -- legitimate customers don't
// start 20 checkouts a minute; a card-testing script does.
const CHECKOUT_RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.CHECKOUT_RATE_LIMIT_MAX_ATTEMPTS) || 10;
const CHECKOUT_RATE_LIMIT_WINDOW_MS = (Number(process.env.CHECKOUT_RATE_LIMIT_WINDOW_SECONDS) || 60) * 1000;

const CheckoutRequest = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().default(1),
  // Commerce-to-Licensing Lifecycle Automation, Phase 1 (Wave 2
  // Workstream 5) — identity-linking groundwork only, not exposed in the
  // public storefront UI yet (no real Teracom SaaS tier is wired to a
  // real Stripe product; that pricing decision is still open). When a
  // future caller does know which Teracom Licence a purchase is for,
  // passing it here lets app/api/webhooks/stripe/route.js later write a
  // real LicenceBillingReference; omitted for every ordinary storefront
  // checkout today.
  licenceId: z.string().optional(),
});

export async function POST(req) {
  const rateLimitKey = `checkout:${clientIpFromRequest(req)}`;
  const rateLimit = checkRateLimit(rateLimitKey, {
    maxAttempts: CHECKOUT_RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: CHECKOUT_RATE_LIMIT_WINDOW_MS,
  });
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds, 'Too many checkout attempts. Please try again shortly.');
  }

  const siteUrl = SITE_URL;
  const parsed = CheckoutRequest.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid checkout request' }, { status: 400 });
  }

  const product = findProduct(parsed.data.productId);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const isSubscription = product.type === 'subscription';

  const metadata = {
    productId: product.id,
    sku: product.sku,
    productType: product.type,
    ...(parsed.data.licenceId ? { licenceId: parsed.data.licenceId } : {}),
  };

  // Stripe throwing here (bad/missing API key, network error, etc.) must
  // never reach the client as a body-less 500 -- Next's default error
  // handler for an uncaught route exception returns no JSON body, and the
  // client's res.json() call then fails with a confusing "Unexpected end
  // of JSON input" that hides the real problem.
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: product.name,
              description: product.description,
              metadata: { sku: product.sku, productType: product.type },
            },
            unit_amount: product.priceCents,
            ...(isSubscription ? { recurring: { interval: 'month' } } : {}),
          },
          quantity: parsed.data.quantity,
        },
      ],
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      metadata,
      // A Checkout Session's own metadata does NOT propagate onto the
      // Subscription object it creates — only subscription_data.metadata
      // does. Without this, later customer.subscription.updated/deleted
      // and invoice.paid renewal webhook events would have no way to see
      // licenceId at all (see app/api/webhooks/stripe/route.js).
      ...(isSubscription ? { subscription_data: { metadata } } : {}),
    });
  } catch (error) {
    console.error('Stripe checkout session creation failed', error);
    return NextResponse.json({ error: 'Unable to start checkout right now. Please try again shortly.' }, { status: 502 });
  }

  return NextResponse.json({ url: session.url });
}
