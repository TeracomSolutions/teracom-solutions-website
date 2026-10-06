import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { listHolds } from '@/lib/api/adminHolds';

const STATUSES = ['pending', 'approved', 'dismissed', 'cleared'];

// The held price list rows, for the Needs review page and the count in the
// Store tabs. ?status= is one of pending (the default), approved, dismissed, cleared.
export const GET = withAdminSession(async ({ req, token }) => {
  const asked = new URL(req.url).searchParams.get('status');
  return NextResponse.json(await listHolds(token, STATUSES.includes(asked) ? asked : 'pending'));
});
