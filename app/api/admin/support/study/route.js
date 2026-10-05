import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { startSupportStudy } from '@/lib/api/support';

// Starts a product study run on the backend (Study now on the Support page).
export const POST = withAdminSession(async ({ token }) => NextResponse.json(await startSupportStudy(token)));