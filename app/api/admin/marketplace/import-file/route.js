import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

export const POST = withAdminSession(async ({ req, token }) => {
  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Choose a file to import.' }, { status: 400 });
  }
  const file = form.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Choose a file to import.' }, { status: 400 });
  }
  const body = new FormData();
  body.set('provider', String(form.get('provider') || ''));
  body.set('markup_percent', String(form.get('markup_percent') || '0'));
  body.set('shipping_cents', String(form.get('shipping_cents') || '0'));
  body.set('file', file, file.name);
  return NextResponse.json(await backendFetch('/staff/marketplace/import-file', { token, method: 'POST', body }));
});
