import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { createSupplierDirect, fetchAllSuppliers } from '@/lib/api/adminSuppliers';

const CreateRequest = z.object({
  name: z.string().trim().min(1).max(200),
  supplierType: z.enum(['manufacturer', 'distributor']),
});

// Data Feeds: every supplier, and adding one.
export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchAllSuppliers(token));
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = CreateRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'A supplier needs a name and a type.' }, { status: 400 });
  }
  return NextResponse.json(await createSupplierDirect(token, parsed.data), { status: 201 });
});
