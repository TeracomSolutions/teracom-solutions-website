import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { deactivateProduct } from '@/lib/api/adminCatalog';

// Takes a product off the store (soft delete on the backend).
export const DELETE = withAdminSession(async ({ token, params }) => {
  await deactivateProduct(token, params.productId);
  return NextResponse.json({ ok: true });
});
