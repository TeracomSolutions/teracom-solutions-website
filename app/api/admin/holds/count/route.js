import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { holdCounts } from '@/lib/api/adminHolds';

// How many held price list rows are waiting, for the Needs review tab.
export const GET = withAdminSession(async ({ token }) => NextResponse.json({ counts: await holdCounts(token) }));
