import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { getSupportProgress } from '@/lib/api/support';

export const dynamic = 'force-dynamic';

// What the library rebuild and the product study are doing now, polled by the Support page.
export const GET = withAdminSession(async ({ token }) => NextResponse.json(await getSupportProgress(token)));
