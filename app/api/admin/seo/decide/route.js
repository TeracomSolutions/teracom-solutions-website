import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { decideRedirects } from '@/lib/api/adminSeo';

// Yes (approve: the redirect goes live) or no (reject: never redirect it).
const DecideRequest = z.object({
  ids: z.array(z.string().uuid()).min(1).max(500),
  action: z.enum(['approve', 'reject']),
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = DecideRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Choose at least one redirect and what to do with it.' }, { status: 400 });
  }
  return NextResponse.json(await decideRedirects(token, parsed.data.ids, parsed.data.action));
});