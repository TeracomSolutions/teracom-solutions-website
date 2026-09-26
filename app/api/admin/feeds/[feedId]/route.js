import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { deleteSupplierFeed, updateSupplierFeed } from '@/lib/api/adminSupplierFeeds';

const UpdateRequest = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    url: z.string().trim().url().max(2000).optional(),
    format: z.enum(['auto', 'csv', 'xlsx', 'xls', 'json', 'xml']).optional(),
    recurrence: z.enum(['manual', 'daily', 'weekly']).optional(),
    active: z.boolean().optional(),
    auth_header_name: z.string().trim().max(100).nullable().optional(),
    auth_header_value: z.string().max(4000).nullable().optional(),
    clear_auth: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nothing to change.' });

export const PATCH = withAdminSession(async ({ req, token, params }) => {
  const parsed = UpdateRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the fields and try again.' }, { status: 400 });
  }
  return NextResponse.json(await updateSupplierFeed(token, params.feedId, parsed.data));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await deleteSupplierFeed(token, params.feedId));
});
