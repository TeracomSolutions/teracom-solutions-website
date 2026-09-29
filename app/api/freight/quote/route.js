import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCatalogue } from '@/lib/catalogue';
import { quoteFreight } from '@/lib/api/freight';
import { ApiError } from '@/lib/api/client';
import { freightItems, POSTCODE_PATTERN } from '@/lib/freightParcels';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';

// The cart asks here for the delivery price to a postcode. Sizes and
// weights come from the catalogue on the server, never from the browser.
const QuoteRequest = z.object({
  postcode: z.string().trim().regex(POSTCODE_PATTERN),
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().positive().max(20) }))
    .min(1)
    .max(20),
});

export async function POST(req) {
  const limit = checkRateLimit(`freight-quote:${clientIpFromRequest(req)}`, { maxAttempts: 30, windowMs: 60 * 1000 });
  if (!limit.allowed) {
    return rateLimitResponse(limit.retryAfterSeconds, 'Too many delivery price requests. Please try again shortly.');
  }

  const parsed = QuoteRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a four-digit Australian postcode.' }, { status: 400 });
  }

  const { products } = await getCatalogue();
  const lines = parsed.data.items
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) || null }))
    .filter((line) => line.product);

  if (freightItems(lines).length === 0) {
    return NextResponse.json({ postcode: parsed.data.postcode, options: [] });
  }

  try {
    const result = await quoteFreight({ lines, postcode: parsed.data.postcode });
    return NextResponse.json({ postcode: result.postcode, options: result.options || [] });
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      return NextResponse.json({ error: error.message || 'Enter a four-digit Australian postcode.' }, { status: 400 });
    }
    console.error('Freight quote failed', error);
    return NextResponse.json({ error: 'We could not price delivery just now. Please try again shortly.' }, { status: 502 });
  }
}