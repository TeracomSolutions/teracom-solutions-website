import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchUploadRemoval } from '@/lib/api/adminSuppliers';

// What removing one uploaded price list would do (products added, how many are live).
export const GET = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await fetchUploadRemoval(token, params.uploadId));
});
