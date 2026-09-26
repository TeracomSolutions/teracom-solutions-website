import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchPriceList } from '@/lib/api/adminCatalog';

export const GET = withAdminSession(async ({ req, token }) => {
  const { searchParams } = new URL(req.url);
  return NextResponse.json(
    await fetchPriceList(token, {
      supplierId: searchParams.get('supplier_id') || undefined,
      q: searchParams.get('q') || undefined,
      includeInactive: searchParams.get('include_inactive') === 'true',
    })
  );
});
