import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchSheetIds } from '@/lib/api/adminSheet';
import { pickSheetParams } from '@/lib/sheetQuery';

export const GET = withAdminSession(async ({ req, token }) => {
  const { searchParams } = new URL(req.url);
  return NextResponse.json(await fetchSheetIds(token, pickSheetParams(searchParams)));
});
