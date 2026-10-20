import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchPermissionsCatalogue } from '@/lib/api/adminStaffUsers';

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchPermissionsCatalogue(token)));
