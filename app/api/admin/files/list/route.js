import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchFileList } from '@/lib/api/adminFiles';

const ROOT = /^[a-z0-9-]{1,40}$/;

// One folder of the server's files, read-only. ?root= is one of the listed places, ?path= a folder inside it.
export const GET = withAdminSession(async ({ req, token }) => {
  const params = new URL(req.url).searchParams;
  const root = params.get('root') || '';
  if (!ROOT.test(root)) return NextResponse.json({ error: 'Unknown folder' }, { status: 400 });
  return NextResponse.json(await fetchFileList(token, root, (params.get('path') || '').slice(0, 500)));
});
