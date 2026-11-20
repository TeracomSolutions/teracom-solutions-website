import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

// Saves a report (new, or changes to one already saved).
export const POST = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.name !== 'string' || typeof body.spec !== 'object') return NextResponse.json({ error: 'The report was not understood.' }, { status: 400 });
  return NextResponse.json(await backendFetch('/staff/reports/saved', { method: 'POST', token, body: { name: body.name, spec: body.spec, id: typeof body.id === 'string' ? body.id : undefined } }));
}, { verify: true });
