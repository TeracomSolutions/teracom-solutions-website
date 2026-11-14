import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

// The Dashboard's lights (api/staff_dashboard.py in the backend).
export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await backendFetch('/staff/dashboard', { token }));
}, { fallback: 'The dashboard did not answer in time. Try again.' });
