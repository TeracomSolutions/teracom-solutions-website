import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { deleteResourceDocument, updateResourceDocument } from '@/lib/api/adminResources';

const DOC_TYPES = ['datasheet', 'user_manual', 'installer_manual', 'brochure', 'other'];

const UpdateRequest = z
  .object({
    title: z.string().trim().min(1).max(500).optional(),
    doc_type: z.enum(DOC_TYPES).optional(),
    sku: z.string().trim().max(100).nullable().optional(),
    brand: z.string().trim().max(100).nullable().optional(),
    published: z.boolean().optional(),
    notes: z.string().max(4000).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nothing to change.' });

export const PATCH = withAdminSession(async ({ req, token, params }) => {
  const parsed = UpdateRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the fields and try again.' }, { status: 400 });
  }
  return NextResponse.json(await updateResourceDocument(token, params.documentId, parsed.data));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await deleteResourceDocument(token, params.documentId));
});
