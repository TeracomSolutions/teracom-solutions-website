import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { getSupportBrands } from '@/lib/api/support';

// Every store brand with its product count, for What Tera learns.
export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await getSupportBrands(token));
});
