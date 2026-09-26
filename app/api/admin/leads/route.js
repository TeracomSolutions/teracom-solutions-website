import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchLeads } from '@/lib/api/adminWebsiteIntelligence';

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchLeads(token));
});
