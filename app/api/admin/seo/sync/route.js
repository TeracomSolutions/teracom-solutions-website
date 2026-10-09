import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { startSync } from '@/lib/api/adminSeo';

// Search now: ask Google again which pages it shows and look for old addresses.
export const POST = withAdminSession(async ({ token }) => NextResponse.json(await startSync(token)));