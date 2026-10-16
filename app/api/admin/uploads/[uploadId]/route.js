import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { removeUpload } from '@/lib/api/adminSuppliers';

// Removes one upload from the history; ?remove_products=true also deletes the products it added.
export const DELETE = withAdminSession(async ({ req, token, params }) => {
  const removeProducts = new URL(req.url).searchParams.get('remove_products') === 'true';
  return NextResponse.json(await removeUpload(token, params.uploadId, removeProducts));
});
