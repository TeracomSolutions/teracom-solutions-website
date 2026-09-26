import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchResourceDocuments } from '@/lib/api/adminResources';

export const GET = withAdminSession(async ({ req, token }) => {
  const { searchParams } = new URL(req.url);
  return NextResponse.json(
    await fetchResourceDocuments(token, {
      sourceId: searchParams.get('source_id') || undefined,
      status: searchParams.get('status') || undefined,
      docType: searchParams.get('doc_type') || undefined,
      q: searchParams.get('q') || undefined,
    })
  );
});
