import { NextResponse } from 'next/server';
import { z } from 'zod';

import { submitLead } from '@/lib/api/leads';
import { getAllProducts } from '@/lib/catalogue';
import { materialsList, money } from '@/lib/estimator';
import { priceEstimate } from '@/lib/estimatorPricing';
import { sameOrigin, signedInCustomer } from '@/lib/estimatorRoute';
import { checkSharedRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';

// "Ask us to quote the materials" from the Estimator (Robert, 20 November 2026): the
// estimate's store products go to Sales as an enquiry from the signed-in customer. Names
// and prices come from the catalogue here, never from the browser. The customer's labour
// and their own markup are not sent.
const Body = z.object({
  estimate: z.record(z.string(), z.unknown()),
  phone: z.string().max(40).default(''),
  notes: z.string().max(2000).default(''),
});

export async function POST(req) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  const who = await signedInCustomer();
  if (who.error) return who.error;
  const { customer } = who;
  const rateLimit = await checkSharedRateLimit(`estimator-quote:${customer.id}`, { maxAttempts: 5, windowMs: 3_600_000 });
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds, 'You have sent a few already. Try again later, or email us.');
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Something in the request was not right.' }, { status: 400 });

  const priced = priceEstimate(parsed.data.estimate, await getAllProducts(), who.pricing);
  const byId = new Map(priced.sections.flatMap((s) => s.lines).filter((l) => l.type === 'product').map((l) => [l.productId, l]));
  const items = materialsList(priced).filter((item) => !item.unavailable);
  if (!items.length) return NextResponse.json({ error: 'There are no store products in this estimate yet.' }, { status: 400 });

  let totalCents = 0;
  const rows = items.map((item) => {
    const unit = byId.get(item.productId)?.unitCents;
    const line = typeof unit === 'number' ? unit * item.qty : null;
    if (line !== null) totalCents += line;
    return `${item.qty} x ${item.sku ? `${item.sku} ` : ''}${item.name}${line !== null ? ` (${money(line)} inc GST at their price)` : ''}`;
  });
  const phone = parsed.data.phone || customer.phone || '';
  const message = [
    'Materials quote request from the Estimator.',
    priced.name ? `Job: ${priced.name}` : '',
    priced.site ? `Site: ${priced.site}` : '',
    phone ? `Phone: ${phone}` : '',
    parsed.data.notes ? `\nNotes from the customer:\n${parsed.data.notes}` : '',
    '',
    ...rows,
    '',
    `Materials at their store price: ${money(totalCents)} inc GST`,
  ].filter((line, i, all) => line !== '' || all[i - 1] !== '').join('\n');

  try {
    await submitLead({
      name: [customer.first_name, customer.last_name].filter(Boolean).join(' ') || customer.email,
      email: customer.email,
      company: customer.company || undefined,
      inquiry_type: 'contact_sales',
      message: message.slice(0, 8000),
    }, clientIpFromRequest(req));
  } catch (error) {
    console.error('Estimator quote request failed', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'It did not send. Try again, or email us.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

export const dynamic = 'force-dynamic';
