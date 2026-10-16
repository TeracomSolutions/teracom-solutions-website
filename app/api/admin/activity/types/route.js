import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchActivityTypes } from '@/lib/api/adminActivity';

// Every kind of event in the audit trail, with its plain-English label and how many there are.
export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchActivityTypes(token));
});
