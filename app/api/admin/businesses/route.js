import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { createManagedBusiness, fetchManagedBusinesses } from '@/lib/api/adminSuppliers';

const CreateRequest = z.object({
  name: z.string().trim().min(1).max(200),
  websiteUrl: z.string().trim().url().max(500),
});

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchManagedBusinesses(token));
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = CreateRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'A business needs a name and a full website URL (https://...).' }, { status: 400 });
  }
  return NextResponse.json(await createManagedBusiness(token, parsed.data), { status: 201 });
});
