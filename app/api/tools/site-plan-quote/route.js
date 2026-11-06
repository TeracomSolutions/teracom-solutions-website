import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCurrentCustomer } from '@/lib/api/customerAuth';
import { submitLead } from '@/lib/api/leads';
import { getCatalogue } from '@/lib/catalogue';
import { unitPriceCents } from '@/lib/catalogueMerge';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import { checkSharedRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';
import { MAX_PART_LINES, partLine, partsText } from '@/siteplan/quote';

// "Ask for an installed quote" from the Site Plan Designer (Robert, 2026-11-06): the
// plan's parts list goes to Sales as an enquiry from the signed-in customer. Names and
// prices are looked up here from the catalogue; the browser only says which product
// and how many, so a request cannot carry a made-up price.
const Body = z.object({
  planName: z.string().max(200).default(''),
  deviceCount: z.number().int().min(0).max(1000).default(0),
  site: z.string().max(200).default(''),
  phone: z.string().max(40).default(''),
  notes: z.string().max(2000).default(''),
  lines: z.array(z.object({
    key: z.string().min(1).max(40),
    qty: z.number().int().min(0).max(9999),
    productId: z.string().max(120).default(''),
    metres: z.number().min(0).max(100000).optional(),
  })).min(1).max(MAX_PART_LINES),
});

function sameOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

export async function POST(req) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: 'Sign in to send a quote request.' }, { status: 401 });
  let customer;
  try {
    customer = await getCurrentCustomer(token);
  } catch {
    return NextResponse.json({ error: 'Sign in to send a quote request.' }, { status: 401 });
  }
  const rateLimit = await checkSharedRateLimit(`site-plan-quote:${customer.id}`, { maxAttempts: 5, windowMs: 3_600_000 });
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds, 'You have sent a few already. Try again later, or email us.');
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Something in the request was not right.' }, { status: 400 });
  const body = parsed.data;

  const { products } = await getCatalogue();
  const byId = new Map(products.map((p) => [p.id, p]));
  const pricing = { id: customer.id, tier: customer.pricing_tier || null };
  let totalCents = 0;
  let unpriced = 0;
  const rows = body.lines.flatMap((line) => {
    const part = partLine(line.key);
    if (!part) return [];
    const product = line.productId ? byId.get(line.productId) || null : null;
    const unitCents = product ? unitPriceCents(product, pricing) : null;
    const lineCents = typeof unitCents === 'number' ? unitCents * line.qty : null;
    if (lineCents === null) {
      if (line.qty > 0) unpriced += 1;
    } else totalCents += lineCents;
    return [{ ...part, qty: line.qty, metres: line.metres ? Math.round(line.metres) : 0, product: product ? { name: product.name, sku: product.sku } : null, lineCents }];
  });
  if (!rows.length) return NextResponse.json({ error: 'The parts list is empty.' }, { status: 400 });

  const phone = body.phone || customer.phone || '';
  const head = ['Installed quote request from the Site Plan Designer.', body.site ? `Site: ${body.site}` : '', phone ? `Phone: ${phone}` : ''].filter(Boolean);
  if (body.notes) head.push('', 'Notes from the customer:', body.notes);
  const message = [...head, '', partsText(body.planName, body.deviceCount, { rows, totalCents, unpriced })].join('\n');

  try {
    await submitLead({
      name: [customer.first_name, customer.last_name].filter(Boolean).join(' ') || customer.email,
      email: customer.email,
      company: customer.company || undefined,
      inquiry_type: 'contact_sales',
      message: message.slice(0, 8000),
    }, clientIpFromRequest(req));
  } catch (error) {
    console.error('Site plan quote request failed', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'It did not send. Try again, or email us.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

export const dynamic = 'force-dynamic';
