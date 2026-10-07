import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchFacets } from '@/lib/api/adminSheet';

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchFacets(token)));