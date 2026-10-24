import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchMarketing } from '@/lib/api/adminMarketing';

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchMarketing(token)));
