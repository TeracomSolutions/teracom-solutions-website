import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { setSupplierBrandRule } from '@/lib/api/adminSuppliers';

const RuleRequest = z.object({
  brands: z.array(z.string().trim().min(1).max(100)).max(1000),
});

// Sets the brands a supplier's imports keep to; an empty list clears it.
export const PUT = withAdminSession(async ({ req, token, params }) => {
  const parsed = RuleRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Send the list of brands to keep.' }, { status: 400 });
  }
  return NextResponse.json(await setSupplierBrandRule(token, params.supplierId, parsed.data.brands));
});