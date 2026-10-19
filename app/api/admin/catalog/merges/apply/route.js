// Applies one approved merge
import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { applyMerge } from '@/lib/api/adminProductMerge';
import { cleanMergeRequest } from '@/lib/productMerge';

export const POST = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => null);
  const cleaned = cleanMergeRequest(body);

  if (cleaned.error) {
    return NextResponse.json({ error: cleaned.error }, { status: 400 });
  }

  return NextResponse.json(await applyMerge(token, cleaned));
});
