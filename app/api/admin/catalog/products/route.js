import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { createProduct, listCatalogProducts } from '@/lib/api/adminCatalog';

const CreateRequest = z.object({
  sku: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().max(5000).optional().nullable(),
  category: z.string().trim().min(1).max(100).default('Uncategorised'),
  brand: z.string().trim().max(100).optional().nullable(),
  supplier_id: z.string().uuid().optional().nullable(),
  price: z.number().min(0),
  cost: z.number().min(0).optional().nullable(),
  stock: z.number().int().min(0).default(0),
});

export const GET = withAdminSession(async ({ req, token }) => {
  const { searchParams } = new URL(req.url);
  return NextResponse.json(
    await listCatalogProducts(token, {
      skip: Number(searchParams.get('skip')) || 0,
      limit: Number(searchParams.get('limit')) || 100,
      supplierId: searchParams.get('supplier_id') || undefined,
      q: searchParams.get('q') || undefined,
      includeInactive: searchParams.get('include_inactive') !== 'false',
    })
  );
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = CreateRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'A product needs a SKU, a name and an RRP.' }, { status: 400 });
  }
  return NextResponse.json(await createProduct(token, parsed.data), { status: 201 });
});
