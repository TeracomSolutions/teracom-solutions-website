import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { searchZohoVendors } from '@/lib/api/adminSupplierOrdering';

// Find in Zoho on a supplier's Ordering details: Zoho Books vendors whose name matches ?q=.
export const GET = withAdminSession(async ({ req, token }) => {
  const q = (new URL(req.url).searchParams.get('q') || '').slice(0, 60);
  return NextResponse.json(await searchZohoVendors(token, q));
});
