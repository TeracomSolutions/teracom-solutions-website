import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { createResourceSource, fetchResourceSources } from '@/lib/api/adminResources';

const DOC_TYPES = ['datasheet', 'user_manual', 'installer_manual', 'brochure', 'other'];
const RECURRENCES = ['manual', 'daily', 'weekly', 'monthly'];

const CreateRequest = z.object({
  name: z.string().trim().min(1).max(200),
  url: z.string().trim().url().max(2000),
  supplier_id: z.string().uuid().nullable().optional(),
  doc_types: z.array(z.enum(DOC_TYPES)).default([]),
  recurrence: z.enum(RECURRENCES).default('weekly'),
  follow_links: z.boolean().default(false),
  max_pages: z.number().int().min(1).max(100).default(20),
});

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchResourceSources(token));
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = CreateRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'A source needs a name and a full web address (https://...).' }, { status: 400 });
  }
  return NextResponse.json(await createResourceSource(token, parsed.data), { status: 201 });
});
