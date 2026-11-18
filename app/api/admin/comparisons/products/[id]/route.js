import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';
import { COMPARISONS_TAG } from '@/lib/comparisons';

// Resources > Product comparisons (backend api/comparisons.py); the public pages pick changes up straight away.
function refresh() {
  revalidateTag(COMPARISONS_TAG);
  revalidatePath('/resources/comparisons', 'layout');
}

async function body(req) {
  const data = await req.json().catch(() => null);
  return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
}

export const PUT = withAdminSession(async ({ req, token, params }) => {
  const saved = await backendFetch(`/staff/comparisons/products/${encodeURIComponent(params.id)}`, { method: 'PUT', token, body: await body(req) });
  refresh();
  return NextResponse.json(saved);
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  const saved = await backendFetch(`/staff/comparisons/products/${encodeURIComponent(params.id)}`, { method: 'DELETE', token });
  refresh();
  return NextResponse.json(saved);
});
