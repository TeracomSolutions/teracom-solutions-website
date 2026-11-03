// The card fraud check on store orders (Robert, 2026-11-03): what Stripe found on a
// paid checkout, gathered for the backend's rules (teracom-website-backend
// services/order_risk.py). Pure, with relative imports, so the plain Node test runner
// can load it; app/api/webhooks/stripe/route.js does the fetching and sending.

// From here the bank's security check (3D Secure) is asked for at checkout.
export const THREE_D_SECURE_FROM_CENTS = 50000;

/** Checkout's card options for an order of this many cents: 3D Secure from $500. */
export function cardOptionsFor(totalCents) {
  return totalCents >= THREE_D_SECURE_FROM_CENTS ? { payment_method_options: { card: { request_three_d_secure: 'any' } } } : {};
}

const address = (a, name) =>
  a ? { name: name || null, line1: a.line1 || null, line2: a.line2 || null, city: a.city || null, state: a.state || null, postcode: a.postal_code || null, country: a.country || null } : null;

/** What the backend needs from a paid checkout session and its charge. */
export function riskRequest(session, charge) {
  const card = charge?.payment_method_details?.card || {};
  const checks = card.checks || {};
  const shipping = session?.collected_information?.shipping_details || session?.shipping_details || null;
  return {
    session_id: session.id,
    payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || null,
    email: session.customer_details?.email || null,
    name: session.customer_details?.name || null,
    total_cents: session.amount_total || 0,
    customer_id: session.metadata?.teracomCustomerId || null,
    shipping: shipping ? address(shipping.address, shipping.name) : null,
    billing: address(session.customer_details?.address, session.customer_details?.name),
    signals: {
      risk_level: charge?.outcome?.risk_level || null,
      risk_score: typeof charge?.outcome?.risk_score === 'number' ? charge.outcome.risk_score : null,
      outcome_type: charge?.outcome?.type || null,
      cvc_check: checks.cvc_check || null,
      postcode_check: checks.address_postal_code_check || null,
      line1_check: checks.address_line1_check || null,
      card_country: card.country || null,
      funding: card.funding || null,
      three_d_secure: card.three_d_secure?.result || null,
      wallet: card.wallet?.type || null,
      brand: card.brand || null,
    },
  };
}

/** Metadata put on the Stripe payment of a held order, so it shows in Stripe too. */
export function holdMetadata(reasons) {
  return { teracomHold: 'yes', teracomHoldReasons: (reasons || []).join(' | ').slice(0, 480) };
}
