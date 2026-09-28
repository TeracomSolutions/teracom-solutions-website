import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { resourceUploadTicket } from '@/lib/api/adminResources';

export const POST = withAdminSession(async ({ token }) => {
  return NextResponse.json(await resourceUploadTicket(token));
});