import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { listCustomers } from '@/lib/api/adminCustomers';

// The Customers tab under Social: passes through only the filters the
// backend knows (GET /staff/customers), nothing else from the address.
const ALLOWED = ['q', 'consent', 'tier', 'login', 'sort', 'page', 'page_size'];

export const GET = withAdminSession(async ({ req, token }) => {
  const incoming = new URL(req.url).searchParams;
  const params = {};
  for (const key of ALLOWED) {
    const value = incoming.get(key);
    if (value !== null && value !== '') params[key] = key === 'q' ? value.slice(0, 200) : value.slice(0, 40);
  }
  return NextResponse.json(await listCustomers(token, params));
});
