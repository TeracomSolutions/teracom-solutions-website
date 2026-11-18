import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

const MAX_BYTES = 2 * 1024 * 1024;

// The business's logo on System > Business profile (PNG, JPG or WebP, up to 2 MB).
export const POST = withAdminSession(async ({ req, token }) => {
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file === 'string' || !file.size) {
    return NextResponse.json({ error: 'Choose a picture file.' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'The logo must be 2 MB or smaller.' }, { status: 400 });
  }
  const out = new FormData();
  out.append('file', file, file.name || 'logo');
  return NextResponse.json(await backendFetch('/staff/business-profile/logo', { method: 'POST', token, body: out }));
});
