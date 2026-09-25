import { NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { findProduct, memberPriceCents } from '@/lib/products';
import { SITE_URL } from '@/lib/config';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';
import { cookies } from 'next/headers';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import { getCurrentCustomer } from '@/lib/api/customerAuth';
import { validateCoupon } from '@/lib/api/coupons';
import { ApiError } from '@/lib/api/client';

// Same card-testing rationale as app/api/checkout/route.js -- reuses the
// same env vars so both endpoints share one operator-facing knob, but a
// distinct rate-limit bucket key ('cart-checkout:' below) so a burst on one
// endpoint doesn't consume the other's allowance.
const CART_CHECKOUT_RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.CHECKOUT_RATE_LIMIT_MAX_ATTEMPTS) || 10;
const CART_CHECKOUT_RATE_LIMIT_WINDOW_MS = (Number(process.env.CHECKOUT_RATE_LIMIT_WINDOW_SECONDS) || 60) * 1000;

// Flat-rate placeholder freight (Robert, 2026-09-10): no per-product
// weight/dimension data exists yet to support real carrier-calculated
// shipping, so this is a single static AU-wide rate applied whenever the
// cart contains at least one physical ('hardware') item -- a pure
// digital/software/service order never gets a shipping line. Revisit once
// real weight/size data exists (e.g. from the recovered historical
// catalogue) to move to Stripe's per-item shipping or a carrier API.
const FLAT_SHIPPING_RATE_CENTS = Number(process.env.FLAT_SHIPPING_RATE_CENTS) || 1500;

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
  // Only the code travels from the browser. What it is worth is decided
  // here, from the catalogue -- a discount amount sent by a client is a
  // suggestion, not a fact.
  couponCode: z.string().max(40).optional(),
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

  // Server-side login check - must be done after rate limit but before zod parse
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Sign in to complete checkout.' }, { status: 401 });
  }

  // Verify the customer token
  try {
    await getCurrentCustomer(token);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return NextResponse.json({ error: 'Sign in to complete checkout.' }, { status: 401 });
    }
    // For any other error (network failure, etc.)
    return NextResponse.json({ error: 'Unable to verify your account right now. Please try again shortly.' }, { status: 502 });
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
  const hasPhysicalItem = lines.some(({ product }) => product.type === 'hardware');

  // --- discount code -------------------------------------------------------
  // Revalidated here even though the cart already checked it: the cart's
  // answer is minutes old, the code may have expired, hit its redemption
  // limit or been switched off since, and the cart contents may have changed
  // underneath it. The amount is recomputed from the subtotal we just built
  // out of verified member prices.
  let discount = null;
  if (parsed.data.couponCode) {
    const subtotal = lines.reduce(
      (sum, { item, product }) => sum + memberPriceCents(product) * item.quantity,
      0
    );
    try {
      const result = await validateCoupon({
        code: parsed.data.couponCode,
        subtotalCents: subtotal,
        customerId: customer?.id || null,
        clientIp: clientIpFromRequest(req),
      });
      if (result?.valid && result.discount_cents > 0) {
        discount = { code: result.code, label: result.label, cents: result.discount_cents };
      } else if (result?.reason) {
        // Stop rather than quietly charging full price. Someone who typed a
        // code expects it applied, and finding out afterwards on the receipt
        // is how a chargeback starts.
        return NextResponse.json({ error: result.reason }, { status: 400 });
      }
    } catch (err) {
      console.error('Coupon revalidation failed at checkout', err instanceof ApiError ? err.status : err);
      return NextResponse.json(
        { error: 'We could not apply that discount code just now. Please remove it or try again shortly.' },
        { status: 502 }
      );
    }
  }

  // A one-off Stripe coupon carrying the amount our own rules produced.
  // Stripe does the arithmetic on the session and shows the discount on the
  // receipt; it never holds the rule. Short-lived and single-use so an
  // abandoned checkout does not leave a live coupon lying in the account.
  let stripeCouponId = null;
  if (discount) {
    try {
      const created = await stripe.coupons.create({
        amount_off: discount.cents,
        currency: 'aud',
        duration: 'once',
        name: discount.label?.slice(0, 40) || discount.code,
        max_redemptions: 1,
        redeem_by: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        metadata: { teracomCouponCode: discount.code },
      });
      stripeCouponId = created.id;
    } catch (err) {
      console.error('Could not create the Stripe coupon', err);
      return NextResponse.json(
        { error: 'We could not apply that discount code just now. Please remove it or try again shortly.' },
        { status: 502 }
      );
    }
  }

  // Stripe throwing here (bad/missing API key, network error, etc.) must
  // never reach the client as a body-less 500 -- Next's default error
  // handler for an uncaught route exception returns no JSON body, and the
  // client's res.json() call then fails with a confusing "Unexpected end
  // of JSON input" that hides the real problem.
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lines.map(({ item, product }) => ({
        price_data: {
          currency: 'aud',
          product_data: {
            name: product.name,
            description: product.description,
            metadata: { sku: product.sku, productType: product.type },
          },
          // Only verified signed-in customers get this far, so they pay the member price.
          unit_amount: memberPriceCents(product),
        },
        quantity: item.quantity,
      })),
      // Payment happens on our own page rather than on Stripe's. The
      // visitor stays on teracomsolutions.com.au, which matters when
      // someone is deciding whether to put a few thousand dollars on a
      // card -- and it removes the analytics blind spot the redirect
      // created, where every sale looked like it came from Stripe rather
      // than from whatever actually brought the customer in.
      ui_mode: 'embedded',
      return_url: `${siteUrl}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
      // Deliberately NOT allow_promotion_codes. That field puts the codes in
      // Stripe's dashboard, where nothing else can reason about them -- not
      // the customer they were issued to, not a trade tier, not Teracom AI.
      // Our codes live in our own database and Stripe is handed only the
      // resulting amount. The two settings are mutually exclusive in any
      // case.
      ...(stripeCouponId ? { discounts: [{ coupon: stripeCouponId }] } : {}),
      // An installer needs the job reference on the invoice, and a business
      // buyer needs its ABN on it -- chasing either afterwards is the most
      // tedious part of trade bookkeeping. Optional: a consumer buying one
      // camera has neither.
      custom_fields: [
        {
          key: 'purchase_order',
          label: { type: 'custom', custom: 'Purchase order or job reference' },
          type: 'text',
          optional: true,
          text: { maximum_length: 120 },
        },
      ],
      // Collects an ABN. Required on a tax invoice for sales of $1,000 or
      // more, and it is the buyer who suffers if it is missing.
      tax_id_collection: { enabled: true },
      billing_address_collection: 'required',
      // Flags this session for app/api/webhooks/stripe/route.js to itemize
      // via stripe.checkout.sessions.listLineItems at webhook time, rather
      // than trying to cram every cart line into session metadata (Stripe
      // caps each metadata value at 500 characters).
      metadata: {
        cartCheckout: 'true',
        // Everything the webhook needs to record the redemption without
        // recomputing the cart. A redemption is written only once Stripe
        // confirms payment -- a validated code that never becomes a sale
        // must not consume one, or a single-use code could be burned by
        // someone who merely opened the checkout page.
        ...(discount
          ? {
              couponCode: discount.code,
              couponDiscountCents: String(discount.cents),
              couponSubtotalCents: String(
                lines.reduce((sum, { item, product }) => sum + memberPriceCents(product) * item.quantity, 0)
              ),
            }
          : {}),
        ...(customer?.id ? { teracomCustomerId: String(customer.id) } : {}),
      },
      ...(hasPhysicalItem
        ? {
            shipping_address_collection: { allowed_countries: ['AU'] },
            shipping_options: [
              {
                shipping_rate_data: {
                  type: 'fixed_amount',
                  fixed_amount: { amount: FLAT_SHIPPING_RATE_CENTS, currency: 'aud' },
                  display_name: 'Standard Shipping',
                  delivery_estimate: {
                    minimum: { unit: 'business_day', value: 3 },
                    maximum: { unit: 'business_day', value: 7 },
                  },
                },
              },
            ],
          }
        : {}),
    });
  } catch (error) {
    console.error('Stripe cart checkout session creation failed', error);
    return NextResponse.json({ error: 'Unable to start checkout right now. Please try again shortly.' }, { status: 502 });
  }

  // The client secret, not a URL: the payment form mounts on our page.
  return NextResponse.json({ clientSecret: session.client_secret });
}
