import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { contentCounts } from '@/lib/api/adminContent';

// How many products need a look, for the Photos and text tab.
export const GET = withAdminSession(async ({ token }) => NextResponse.json({ counts: await contentCounts(token) }));
