import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchUploadBrands } from '@/lib/api/adminSuppliers';
import { hasBrandPage } from '@/lib/brandPages';

// The brands in one uploaded price list, for choosing which to import. Each
// says whether the website has a brand page for it yet.
export const GET = withAdminSession(async ({ token, params }) => {
  const data = await fetchUploadBrands(token, params.uploadId);
  const brands = (data.brands || []).map((b) => ({ ...b, hasPage: hasBrandPage(b.brand) }));
  return NextResponse.json({ ...data, brands });
});
