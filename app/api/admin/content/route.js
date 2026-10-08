import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { listContent } from '@/lib/api/adminContent';

const STATUSES = ['attention', 'waiting', 'queued', 'working', 'review', 'not_found', 'done', 'left'];

// The products waiting for a photo or description, for the Photos and text
// page. ?status= is one of attention (the default), waiting, review,
// not_found, done, left.
export const GET = withAdminSession(async ({ req, token }) => {
  const asked = new URL(req.url).searchParams.get('status');
  return NextResponse.json(await listContent(token, STATUSES.includes(asked) ? asked : 'attention'));
});
