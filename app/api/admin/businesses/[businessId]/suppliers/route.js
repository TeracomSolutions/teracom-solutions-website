import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { createSupplier, fetchSuppliersForBusiness } from '@/lib/api/adminSuppliers';

const CreateRequest = z.object({
  name: z.string().trim().min(1).max(200),
  supplierType: z.enum(['manufacturer', 'distributor']),
});

export const GET = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await fetchSuppliersForBusiness(token, params.businessId));
});

export const POST = withAdminSession(async ({ req, token, params }) => {
  const parsed = CreateRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'A supplier needs a name and a type.' }, { status: 400 });
  }
  return NextResponse.json(await createSupplier(token, params.businessId, parsed.data), { status: 201 });
});
