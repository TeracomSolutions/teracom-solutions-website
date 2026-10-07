import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchSheet } from '@/lib/api/adminSheet';
import { pickSheetParams } from '@/lib/sheetQuery';

export const GET = withAdminSession(async ({ req, token }) => {
  const { searchParams } = new URL(req.url);
  return NextResponse.json(await fetchSheet(token, pickSheetParams(searchParams)));
});
