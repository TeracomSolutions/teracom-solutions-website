import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

// Check now: the backend reads the maker's pages again in the background (about a minute).
export const POST = withAdminSession(async ({ token, params }) => NextResponse.json(
  await backendFetch(`/staff/comparisons/products/${encodeURIComponent(params.id)}/research`, { method: 'POST', token }),
));
