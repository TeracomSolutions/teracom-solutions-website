import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

// System > Platform rules (api/staff_platform_rules.py in the backend).
export const GET = withAdminSession(async ({ req, token }) => {
  const fresh = new URL(req.url).searchParams.get('fresh') === '1';
  return NextResponse.json(await backendFetch('/staff/platform-rules', { token, searchParams: fresh ? { fresh: 'true' } : undefined }));
}, { fallback: 'The platform rules did not answer in time. Try again.' });
