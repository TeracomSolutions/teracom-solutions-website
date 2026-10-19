import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { fetchMergeCandidates, fetchMergeHistory } from '@/lib/api/adminProductMerge';

/**
 * GET /api/admin/catalog/merges
 * Returns merge candidates and history.
 * The products two suppliers both sell, and the merges already made.
 */
export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json({
    ...(await fetchMergeCandidates(token)),
    history: await fetchMergeHistory(token)
  });
});
