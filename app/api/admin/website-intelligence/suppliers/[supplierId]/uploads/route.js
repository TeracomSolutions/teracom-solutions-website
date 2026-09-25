import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchSupplierUploads, uploadSupplierFeed } from '@/lib/api/adminWebsiteIntelligence';

// Vercel caps a serverless request body at 4.5 MB, so that is the real
// limit here whatever the backend's own (10 MB) allows.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls'];

export const GET = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await fetchSupplierUploads(token, params.supplierId));
});

export const POST = withAdminSession(async ({ req, token, params }) => {
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');

  if (!file || typeof file === 'string' || !file.name) {
    return NextResponse.json({ error: 'Choose a file first.' }, { status: 400 });
  }
  if (!ALLOWED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))) {
    return NextResponse.json({ error: 'Only .csv, .xlsx and .xls files are accepted.' }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'That file is over 4 MB.' }, { status: 413 });
  }

  const upstream = new FormData();
  upstream.append('file', file, file.name);

  return NextResponse.json(await uploadSupplierFeed(token, params.supplierId, upstream), { status: 201 });
});
