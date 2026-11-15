import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';
import { HOME_BANNER_TAG } from '@/lib/homeBanner';

// Saves the home page banner (Resources > Home banner); the home page picks it up straight away.
function refresh() {
  revalidateTag(HOME_BANNER_TAG);
  revalidatePath('/');
}

export const PUT = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.slides)) return NextResponse.json({ error: 'The banner was not understood.' }, { status: 400 });
  const saved = await backendFetch('/staff/home-banner', { method: 'PUT', token, body });
  refresh();
  return NextResponse.json(saved);
});

export const DELETE = withAdminSession(async ({ token }) => {
  const saved = await backendFetch('/staff/home-banner', { method: 'DELETE', token });
  refresh();
  return NextResponse.json(saved);
});
