import { NextResponse } from 'next/server';
import { z } from 'zod';

import { submitFeedback } from '@/lib/api/feedback';
import { clientIpFromRequest } from '@/lib/rateLimit';
import { stripe } from '@/lib/stripe';

// The order-complete page's recommend score, comment and Google review click (components/CheckoutFeedback.js).
// Only a paid Stripe checkout can answer, so the answers are real customers'.
const Answer = z.object({
  session_id: z.string().min(8).max(255).regex(/^cs_[A-Za-z0-9_]+$/),
  score: z.number().int().min(0).max(10).optional(),
  comment: z.string().max(1000).optional(),
  google_clicked: z.boolean().optional(),
});

export async function POST(req) {
  const parsed = Answer.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'That answer was not understood.' }, { status: 400 });
  const { session_id: sessionId, ...answer } = parsed.data;

  let session = null;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    session = null;
  }
  if (!session || session.status !== 'complete' || session.payment_status !== 'paid') {
    return NextResponse.json({ error: 'We could not match that to a paid order.' }, { status: 400 });
  }

  try {
    await submitFeedback({ session_id: sessionId, email: session.customer_details?.email || null, ...answer }, clientIpFromRequest(req));
  } catch {
    return NextResponse.json({ error: 'That did not save. Please try again.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
