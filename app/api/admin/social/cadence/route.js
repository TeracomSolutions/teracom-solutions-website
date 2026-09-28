import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { getCadence, saveCadence } from '@/lib/api/adminSocial';

export const GET = withAdminSession(async ({ token }) => {
  const result = await getCadence(token);
  return NextResponse.json(result);
});

export const PUT = withAdminSession(async ({ token, req }) => {
  const body = await req.json();
  
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: 'Send a list of rules.' }, { status: 400 });
  }
  
  const result = await saveCadence(token, body);
  return NextResponse.json(result);
});