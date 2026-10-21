import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchBuildProgress } from '@/lib/api/adminBuildProgress';

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchBuildProgress(token)));
