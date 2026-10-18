import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { previewMerge } from '@/lib/api/adminProductMerge';
import { cleanMergeRequest } from '@/lib/productMerge';

/**
 * Shows what a merge would do and changes nothing.
 */
export const POST = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => null);
  const cleaned = cleanMergeRequest(body);

  if (cleaned.error) {
    return NextResponse.json({ error: cleaned.error }, { status: 400 });
  }

  return NextResponse.json(await previewMerge(token, cleaned));
});
