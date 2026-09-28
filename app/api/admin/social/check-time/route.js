import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { checkTime } from '@/lib/api/adminSocial';

export const POST = withAdminSession(async ({ token, req }) => {
  const body = await req.json();
  
  const result = await checkTime(token, body);
  return NextResponse.json(result);
});