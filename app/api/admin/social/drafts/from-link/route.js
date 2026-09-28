import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { draftFromLink } from '@/lib/api/adminSocial';

export const POST = withAdminSession(async ({ token, req }) => {
  const body = await req.json();
  
  const result = await draftFromLink(token, String(body.url || ''));
  
  return NextResponse.json(result);
});