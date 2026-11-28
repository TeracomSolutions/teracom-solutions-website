import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchOrderAlerts } from '@/lib/api/adminOrders';
import { checkOrderRisk, forwardCheckoutSession } from '@/lib/api/orderFlow';
import { SESSION_EXPANSIONS } from '@/lib/orderFlowForward';
import { holdMetadata, riskRequest } from '@/lib/orderRisk';
import { importDays, shouldImport, stripeId } from '@/lib/stripeImport';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Sales > Orders, Import paid orders from Stripe (Robert, 27 November 2026). Paid checkouts whose webhook never
// reached us (the signing secret was wrong until 27 November) are read from Stripe and recorded in the backend.
// An order already recorded is left as it is (the backend keys on the checkout session). New ones get the card
// fraud check, the same as the webhook. Nothing is emailed: these orders are old.
export const POST = withAdminSession(async ({ req, token }) => {
  await fetchOrderAlerts(token); // the backend answers only for an administrator; anyone else gets its refusal

  const body = await req.json().catch(() => ({}));
  const days = importDays(body?.days);
  const since = Math.floor(Date.now() / 1000) - days * 86400;
  const one = stripeId(body?.id);
  if (body?.id && !one) return NextResponse.json({ error: 'That is not a Stripe payment ID (pi_...) or checkout ID (cs_...).' }, { status: 400 });

  // One order: the checkout session behind that payment ID, or that checkout ID itself. Nothing else is touched.
  let sessions;
  if (one) {
    sessions = one.startsWith('cs_')
      ? [await stripe.checkout.sessions.retrieve(one)]
      : (await stripe.checkout.sessions.list({ payment_intent: one, limit: 1 })).data;
    if (!sessions.length) return NextResponse.json({ error: `Stripe has no website checkout for ${one}.` }, { status: 404 });
  } else {
    sessions = stripe.checkout.sessions.list({ status: 'complete', created: { gte: since }, limit: 100 });
  }

  const result = { days: one ? null : days, id: one || null, checked: 0, recorded: [], already: 0, skipped: 0, failed: [] };
  for await (const listed of sessions) {
    result.checked += 1;
    if (!shouldImport(listed)) {
      result.skipped += 1;
      continue;
    }
    try {
      const session = await stripe.checkout.sessions.retrieve(listed.id, { expand: SESSION_EXPANSIONS });
      const answer = await forwardCheckoutSession(session, null);
      if (!answer?.recorded) {
        result.failed.push({ session: listed.id, reason: answer?.reason || 'not recorded' });
      } else if (!answer.created) {
        result.already += 1;
      } else {
        result.recorded.push({ name: session.customer_details?.name || session.customer_details?.email || 'Customer', total_cents: session.amount_total || 0, created: session.created });
        await fraudCheck(session);
      }
    } catch (error) {
      result.failed.push({ session: listed.id, reason: error instanceof Error ? error.message.slice(0, 200) : 'failed' });
    }
  }
  return NextResponse.json(result);
}, { fallback: 'Could not import from Stripe.' });

async function fraudCheck(session) {
  try {
    const intentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
    if (!intentId) return;
    const intent = await stripe.paymentIntents.retrieve(intentId, { expand: ['latest_charge'] });
    const charge = intent.latest_charge && typeof intent.latest_charge === 'object' ? intent.latest_charge : null;
    const risk = await checkOrderRisk(riskRequest(session, charge));
    if (risk?.hold) await stripe.paymentIntents.update(intentId, { metadata: holdMetadata(risk.reasons) });
  } catch (error) {
    console.error('Card fraud check failed on import', session.id, error instanceof Error ? error.message : error);
  }
}
