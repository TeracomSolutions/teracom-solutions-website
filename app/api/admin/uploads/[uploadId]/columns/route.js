import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchUploadColumns } from '@/lib/api/adminSuppliers';

// One uploaded price list as the column matching screen needs it: the file's
// headings, sample values and, for each store field, whether it is on and
// which heading it is read from.
export const GET = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await fetchUploadColumns(token, params.uploadId));
});