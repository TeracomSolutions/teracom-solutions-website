import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { bulkPublishResourceDocuments } from '@/lib/api/adminResources';

const SITE_SECTIONS = ['user-manuals', 'datasheets', 'installer-manuals', 'brochures', 'downloads'];

const BulkRequest = z.object({
  document_ids: z.array(z.string().uuid()).max(5000).default([]),
  source_id: z.string().uuid().optional(),
  doc_type: z.string().max(30).optional(),
  status: z.string().max(20).optional(),
  q: z.string().trim().max(200).optional(),
  section: z.enum(SITE_SECTIONS).optional(),
  action: z.enum(['publish', 'unpublish']).default('publish'),
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = BulkRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the fields and try again.' }, { status: 400 });
  }
  return NextResponse.json(await bulkPublishResourceDocuments(token, parsed.data));
});
