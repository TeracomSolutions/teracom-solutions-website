import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { clearSpecial, setSpecial } from '@/lib/api/adminSpecials';

const SpecialRequest = z.object({
  kind: z.enum(['special', 'clearance']),
  price_cents: z.number().int().positive().max(10000000),
  ends_at: z.string().datetime({ offset: true }).nullable().optional(),
});

export const PUT = withAdminSession(async ({ req, token, params }) => {
  const parsed = SpecialRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Choose the type and enter a price above zero.' }, { status: 400 });
  }
  return NextResponse.json(await setSpecial(token, params.productId, parsed.data));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  await clearSpecial(token, params.productId);
  return new NextResponse(null, { status: 204 });
});
