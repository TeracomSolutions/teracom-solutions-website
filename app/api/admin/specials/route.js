import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { listSpecials } from '@/lib/api/adminSpecials';

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await listSpecials(token)));
