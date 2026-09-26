import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { deleteSupplier } from '@/lib/api/adminSuppliers';

// Removes the supplier and its uploads.
export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await deleteSupplier(token, params.supplierId));
});
