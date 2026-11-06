import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAllProducts, getCustomerPricing } from '@/lib/catalogue';
import { unitPriceCents } from '@/lib/catalogueMerge';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import { productPath } from '@/lib/products';
import { checkSharedRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';
import { partChoices } from '@/lib/sitePlanParts';
import { MAX_PART_LINES } from '@/siteplan/quote';

// The store's products for each line of a Site Plan Designer parts list (Robert,
// 2026-11-06). The lines name only a device type or cable (siteplan/quote.js);
// prices are what this visitor pays, and nothing for a guest, as on the tiles.
const Body = z.object({ keys: z.array(z.string().min(1).max(40)).max(MAX_PART_LINES) });

export async function POST(req) {
  const rateLimit = await checkSharedRateLimit(`site-plan-parts:${clientIpFromRequest(req)}`, { maxAttempts: 30, windowMs: 60_000 });
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds, 'Too many requests. Try again in a minute.');
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Bad request' }, { status: 400 });

  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  const customer = await getCustomerPricing(token);
  const products = await getAllProducts();
  const parts = {};
  for (const key of new Set(parsed.data.keys)) {
    parts[key] = partChoices(products, key).map((p) => ({
      id: p.id,
      sku: p.sku || '',
      name: p.name,
      brand: p.brand || '',
      imageUrl: p.imageUrl || null,
      stock: p.stock ?? null,
      href: productPath(p),
      priceCents: customer ? unitPriceCents(p, customer) : null,
    }));
  }
  return NextResponse.json({ parts, signedIn: Boolean(customer) }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export const dynamic = 'force-dynamic';
