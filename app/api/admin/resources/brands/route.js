import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { resourceBrands } from '@/lib/api/adminResources';

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await resourceBrands(token));
});