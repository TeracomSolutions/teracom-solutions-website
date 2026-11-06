import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchNewsHeadlines } from '@/lib/api/adminIndustryNews';

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchNewsHeadlines(token)));
