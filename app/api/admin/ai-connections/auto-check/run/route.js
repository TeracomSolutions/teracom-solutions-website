import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { runAiAutoCheck } from '@/lib/api/adminAiConnections';

export const POST = withAdminSession(async ({ token }) => NextResponse.json(await runAiAutoCheck(token)));
