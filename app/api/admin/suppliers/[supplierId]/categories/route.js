import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { setSupplierCategory } from '@/lib/api/adminSuppliers';

const MappingRequest = z.object({
  sourceCategory: z.string().trim().min(1).max(255),
  // A store category name, or null to keep these products off the category pages.
  storeCategory: z.string().trim().min(1).max(100).nullable(),
});

// Files one of the supplier's categories under a store category.
export const PUT = withAdminSession(async ({ req, token, params }) => {
  const parsed = MappingRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Choose a store category.' }, { status: 400 });
  }
  return NextResponse.json(await setSupplierCategory(token, params.supplierId, parsed.data));
});
