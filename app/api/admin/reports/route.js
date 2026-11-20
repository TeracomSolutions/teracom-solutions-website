import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

// System > Reports: what can be reported on, the ready-made reports and the saved ones (backend api/staff_reports.py).
export const GET = withAdminSession(async ({ token }) => NextResponse.json(await backendFetch('/staff/reports', { token })));
