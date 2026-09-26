import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { clearSupplierOverride, setSupplierOverride } from '@/lib/api/adminPricing';

const OverrideRequest = z.object({ discount_percent: z.number().min(0).max(100) });

export const PUT = withAdminSession(async ({ req, token, params }) => {
  const parsed = OverrideRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'The discount must be a number between 0 and 100.' }, { status: 400 });
  }
  return NextResponse.json(await setSupplierOverride(token, params.supplierId, params.tierKey, parsed.data.discount_percent));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await clearSupplierOverride(token, params.supplierId, params.tierKey));
});
