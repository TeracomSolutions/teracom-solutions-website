import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

const MAX_BYTES = 2 * 1024 * 1024;
const FIELDS = ['logo_url', 'favicon_url'];

// The logo or favicon on System > Business profile (PNG, JPG or WebP, up to 2 MB).
export const POST = withAdminSession(async ({ req, token }) => {
  const field = new URL(req.url).searchParams.get('field') || '';
  if (!FIELDS.includes(field)) return NextResponse.json({ error: 'Unknown picture.' }, { status: 400 });
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file === 'string' || !file.size) {
    return NextResponse.json({ error: 'Choose a picture file.' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'The picture must be 2 MB or smaller.' }, { status: 400 });
  }
  const out = new FormData();
  out.append('file', file, file.name || 'picture');
  return NextResponse.json(await backendFetch(`/staff/business-profile/image/${field}`, { method: 'POST', token, body: out }));
});
