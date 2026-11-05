import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { growthCall } from '@/lib/api/adminGrowth';

// A draft summary and body written by AI from Teracom's own facts and the notes, for a person to check.
export const POST = withAdminSession(async ({ req, token, params }) => {
  const body = await req.json().catch(() => ({}));
  const title = String(body.title || '').trim();
  if (!title) return NextResponse.json({ error: 'Give it a title first.' }, { status: 400 });
  return NextResponse.json(await growthCall(token, 'POST', `${params.key}/draft`, { body: { title, notes: String(body.notes || '') } }));
});
