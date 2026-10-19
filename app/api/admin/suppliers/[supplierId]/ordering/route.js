import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { fetchSupplierOrdering, saveSupplierOrdering } from '@/lib/api/adminSupplierOrdering';
import { cleanOrderingInput } from '@/lib/supplierOrdering';

/**
 * Supplier's ordering details for purchase orders
 */
export const GET = withAdminSession(async ({ token, params }) => NextResponse.json(await fetchSupplierOrdering(token, params.supplierId)));

export const PUT = withAdminSession(async ({ req, token, params }) => {
  let body;
  try {
    body = await req.json();
  } catch (err) {
    body = null;
  }

  const { values, error } = cleanOrderingInput(body);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json(await saveSupplierOrdering(token, params.supplierId, values));
});
