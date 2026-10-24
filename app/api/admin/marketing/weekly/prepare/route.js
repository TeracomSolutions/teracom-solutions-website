import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { prepareWeekly } from '@/lib/api/adminMarketing';

export const POST = withAdminSession(async ({ token }) => NextResponse.json(await prepareWeekly(token)));
