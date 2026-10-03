import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { importUploadWithBrands } from '@/lib/api/adminSuppliers';

const ImportRequest = z.object({
  brands: z.array(z.string().trim().min(1).max(100)).max(1000).nullable().default(null),
  saveRule: z.boolean().default(true),
});

// Imports one uploaded price list, taking only the chosen brands, or the
// supplier's saved brand rule when no brands are sent.
export const POST = withAdminSession(async ({ req, token, params }) => {
  const parsed = ImportRequest.safeParse((await req.json().catch(() => null)) || {});
  if (!parsed.success) {
    return NextResponse.json({ error: 'Choose at least one brand.' }, { status: 400 });
  }
  return NextResponse.json(await importUploadWithBrands(token, params.uploadId, parsed.data));
});