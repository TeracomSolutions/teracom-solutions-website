import { NextResponse } from 'next/server';

import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { createStoreBrand, listStoreBrands } from '@/lib/api/adminBrands';

// The store's brands, for the Brands page's refresh.
export const GET = withAdminSession(async ({ token }) => NextResponse.json(await listStoreBrands(token)));

// Add a brand by hand: it shows on the website straight away.
const NewBrand = z.object({
  name: z.string().trim().min(1).max(200),
  website: z.string().trim().max(300).optional(),
  supported: z.boolean().optional(),
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = NewBrand.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Give the brand a name.' }, { status: 400 });
  return NextResponse.json(await createStoreBrand(token, parsed.data));
});
