import { NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { findProduct } from '@/lib/products';
import { SITE_URL } from '@/lib/config';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';

// Same card-testing rationale as app/api/checkout/route.js -- reuses the
// same env vars so both endpoints share one operator-facing knob, but a
// distinct rate-limit bucket key ('cart-checkout:' below) so a burst on one
// endpoint doesn't consume the other's allowance.
const CART_CHECKOUT_RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.CHECKOUT_RATE_LIMIT_MAX_ATTEMPTS) || 10;
const CART_CHECKOUT_RATE_LIMIT_WINDOW_MS = (Number(process.env.CHECKOUT_RATE_LIMIT_WINDOW_SECONDS) || 60) * 1000;

const CartCheckoutRequest = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive().max(20),
      })
    )
    .min(1)
    .max(20),
});

export async function POST(req) {
  const rateLimitKey = `cart-checkout:${clientIpFromRequest(req)}`;
  const rateLimit = checkRateLimit(rateLimitKey, {
    maxAttempts: CART_CHECKOUT_RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: CART_CHECKOUT_RATE_LIMIT_WINDOW_MS,
  });
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds, 'Too many checkout attempts. Please try again shortly.');
  }

  const parsed = CartCheckoutRequest.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid checkout request' }, { status: 400 });
  }

  const lines = parsed.data.items.map((item) => ({ item, product: findProduct(item.productId) }));

  const missing = lines.find((l) => !l.product);
  if (missing) {
    return NextResponse.json({ error: `Product not found: ${missing.item.productId}` }, { status: 404 });
  }

  // A Checkout Session's mode is either 'payment' or 'subscription', not a
  // mix, and subscriptions already have their own direct Subscribe flow
  // (app/api/checkout/route.js) -- the cart only ever holds one-time items.
  const subscriptionLine = lines.find((l) => l.product.type === 'subscription');
  if (subscriptionLine) {
    return NextResponse.json(
      {
        error: `${subscriptionLine.product.name} is a subscription and must be purchased on its own, not through the cart.`,
      },
      { status: 400 }
    );
  }

  const siteUrl = SITE_URL;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lines.map(({ item, product }) => ({
      price_data: {
        currency: 'aud',
        product_data: {
          name: product.name,
          description: product.description,
          metadata: { sku: product.sku, productType: product.type },
        },
        unit_amount: product.priceCents,
      },
      quantity: item.quantity,
    })),
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    // Flags this session for app/api/webhooks/stripe/route.js to itemize via
    // stripe.checkout.sessions.listLineItems at webhook time, rather than
    // trying to cram every cart line into session metadata (Stripe caps
    // each metadata value at 500 characters).
    metadata: { cartCheckout: 'true' },
  });

  return NextResponse.json({ url: session.url });
}
