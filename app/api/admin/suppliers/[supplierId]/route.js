import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { deleteSupplier, fetchSupplier } from '@/lib/api/adminSuppliers';

export const GET = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await fetchSupplier(token, params.supplierId));
});

// Removes the supplier and its uploads.
export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await deleteSupplier(token, params.supplierId));
});