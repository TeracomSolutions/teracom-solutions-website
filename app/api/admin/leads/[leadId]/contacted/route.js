import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { markLeadContacted } from '@/lib/api/adminLeads';

export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await markLeadContacted(token, params.leadId));
});
