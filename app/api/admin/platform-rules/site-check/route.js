import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

// Check now on System > Platform rules, Website check (services/site_check.py in the backend).
export const POST = withAdminSession(async ({ token }) => {
  return NextResponse.json(await backendFetch('/staff/platform-rules/site-check', { method: 'POST', token }));
}, { verify: true });
