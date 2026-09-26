import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { deactivateProduct, updateProduct } from '@/lib/api/adminCatalog';

const UpdateRequest = z
  .object({
    name: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().max(5000).nullable().optional(),
    category: z.string().trim().min(1).max(100).optional(),
    brand: z.string().trim().max(100).nullable().optional(),
    supplier_id: z.string().uuid().nullable().optional(),
    price: z.number().min(0).optional(),
    cost: z.number().min(0).nullable().optional(),
    stock: z.number().int().min(0).optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nothing to change.' });

export const PATCH = withAdminSession(async ({ req, token, params }) => {
  const parsed = UpdateRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the values and try again.' }, { status: 400 });
  }
  return NextResponse.json(await updateProduct(token, params.productId, parsed.data));
});

// Takes a product off the store (soft delete on the backend).
export const DELETE = withAdminSession(async ({ token, params }) => {
  await deactivateProduct(token, params.productId);
  return NextResponse.json({ ok: true });
});
