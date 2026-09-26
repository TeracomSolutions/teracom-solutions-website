import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { deleteManagedBusiness } from '@/lib/api/adminSuppliers';

// Removes the business, its suppliers and their uploads.
export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await deleteManagedBusiness(token, params.businessId));
});
