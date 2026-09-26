import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { createSupplierFeed, fetchSupplierFeeds } from '@/lib/api/adminSupplierFeeds';

const CreateRequest = z.object({
  name: z.string().trim().min(1).max(200),
  url: z.string().trim().url().max(2000),
  format: z.enum(['auto', 'csv', 'xlsx', 'xls', 'json', 'xml']).default('auto'),
  recurrence: z.enum(['manual', 'daily', 'weekly']).default('weekly'),
  auth_header_name: z.string().trim().max(100).optional().nullable(),
  auth_header_value: z.string().max(4000).optional().nullable(),
});

export const GET = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await fetchSupplierFeeds(token, params.supplierId));
});

export const POST = withAdminSession(async ({ req, token, params }) => {
  const parsed = CreateRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'A feed needs a name and a full web address (https://...).' }, { status: 400 });
  }
  return NextResponse.json(await createSupplierFeed(token, params.supplierId, parsed.data), { status: 201 });
});
