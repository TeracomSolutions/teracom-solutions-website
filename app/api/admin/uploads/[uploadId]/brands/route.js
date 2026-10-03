import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchUploadBrands } from '@/lib/api/adminSuppliers';

// The brands in one uploaded price list, for choosing which to import.
export const GET = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await fetchUploadBrands(token, params.uploadId));
});
