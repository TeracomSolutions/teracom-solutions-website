import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { repriceProducts } from '@/lib/api/adminCatalog';

const RepriceRequest = z.object({
  markup_percent: z.number().min(-100).max(1000),
  supplier_id: z.string().uuid().nullable().optional(),
  product_ids: z.array(z.string().uuid()).max(5000).optional(),
  round_to_cents: z.number().int().min(1).max(100).default(5),
  preview: z.boolean().default(false),
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = RepriceRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a markup percentage.' }, { status: 400 });
  }
  return NextResponse.json(await repriceProducts(token, parsed.data));
});
