import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

// Removes a saved report.
export const DELETE = withAdminSession(async ({ token, params }) => {
  const { id } = await params;
  if (!/^[a-f0-9]{1,32}$/.test(id || '')) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(await backendFetch(`/staff/reports/saved/${id}`, { method: 'DELETE', token }));
}, { verify: true });
