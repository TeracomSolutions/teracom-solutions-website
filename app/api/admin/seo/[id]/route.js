import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { changeRedirect } from '@/lib/api/adminSeo';
import { isSafeTarget } from '@/lib/seoRedirects';

// Send an old address to a page of staff's choosing: a page on this site.
const ChangeRequest = z.object({
  to_path: z.string().trim().min(1).max(300).refine(isSafeTarget, { message: 'Not a page on this site.' }),
});

export const PATCH = withAdminSession(async ({ req, token, params }) => {
  const parsed = ChangeRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Type a page on this site, starting with a slash, like /store/cctv.' }, { status: 400 });
  }
  return NextResponse.json(await changeRedirect(token, params.id, parsed.data.to_path));
});
