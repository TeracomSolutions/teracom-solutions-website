import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { importUploadIntoStore } from '@/lib/api/adminSuppliers';

// Imports one uploaded price list into the store catalogue.
export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await importUploadIntoStore(token, params.uploadId));
});
