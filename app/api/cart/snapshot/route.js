import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { backendFetch } from '@/lib/api/client';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';

// The cart of a signed-in customer, saved for Sales > Carts (only while cart saving is switched on in the
// console). A visitor who is not signed in has nothing saved; any problem is ignored so the cart never breaks.
const Snapshot = z.object({
  items: z.array(z.object({
    sku: z.string().min(1).max(100),
    name: z.string().max(255),
    quantity: z.number().int().min(1).max(10000),
    unit_price_cents: z.number().int().min(0),
  })).max(100),
});

export async function PUT(req) {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return new NextResponse(null, { status: 204 });
  const parsed = Snapshot.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new NextResponse(null, { status: 204 });
  try {
    await backendFetch('/customer-cart', { method: 'PUT', token, body: parsed.data });
  } catch {
    // Saving the cart is a nice-to-have for the figures; the customer's cart itself lives in their browser.
  }
  return new NextResponse(null, { status: 204 });
}
