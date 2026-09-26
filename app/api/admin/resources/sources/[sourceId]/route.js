import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { deleteResourceSource, updateResourceSource } from '@/lib/api/adminResources';

const DOC_TYPES = ['datasheet', 'user_manual', 'installer_manual', 'brochure', 'other'];
const RECURRENCES = ['manual', 'daily', 'weekly', 'monthly'];

const UpdateRequest = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    url: z.string().trim().url().max(2000).optional(),
    supplier_id: z.string().uuid().nullable().optional(),
    doc_types: z.array(z.enum(DOC_TYPES)).optional(),
    recurrence: z.enum(RECURRENCES).optional(),
    follow_links: z.boolean().optional(),
    max_pages: z.number().int().min(1).max(500).optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nothing to change.' });

export const PATCH = withAdminSession(async ({ req, token, params }) => {
  const parsed = UpdateRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the fields and try again.' }, { status: 400 });
  }
  return NextResponse.json(await updateResourceSource(token, params.sourceId, parsed.data));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await deleteResourceSource(token, params.sourceId));
});
