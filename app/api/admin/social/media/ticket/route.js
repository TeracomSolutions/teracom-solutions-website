import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { mediaTicket } from '@/lib/api/adminSocial';

export const POST = withAdminSession(async ({ token }) => {
  return NextResponse.json(await mediaTicket(token));
});
