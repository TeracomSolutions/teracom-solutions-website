import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

// Runs a report. The body only describes it; the backend checks every name and runs it (services/reports.py).
export const POST = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'The report was not understood.' }, { status: 400 });
  return NextResponse.json(await backendFetch('/staff/reports/run', { method: 'POST', token, body }));
}, { verify: true, fallback: 'The report took too long. Narrow the dates or add a filter.' });
