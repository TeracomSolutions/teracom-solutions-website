import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { nextSlot } from '@/lib/api/adminSocial';

export const POST = withAdminSession(async ({ token, req }) => {
  const body = await req.json();
  
  if (!Array.isArray(body.channels)) {
    return NextResponse.json({ error: 'Tick at least one place to post.' }, { status: 400 });
  }
  
  const result = await nextSlot(token, body.channels);
  return NextResponse.json(result);
});