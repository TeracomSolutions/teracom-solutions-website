import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchFileText } from '@/lib/api/adminFiles';

const ROOT = /^[a-z0-9-]{1,40}$/;

// The first part of a text file, for the preview.
export const GET = withAdminSession(async ({ req, token }) => {
  const params = new URL(req.url).searchParams;
  const root = params.get('root') || '';
  if (!ROOT.test(root)) return NextResponse.json({ error: 'Unknown folder' }, { status: 400 });
  return NextResponse.json(await fetchFileText(token, root, (params.get('path') || '').slice(0, 500)));
});
