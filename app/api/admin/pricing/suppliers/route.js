import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchSupplierPricing } from '@/lib/api/adminPricing';

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchSupplierPricing(token));
});
