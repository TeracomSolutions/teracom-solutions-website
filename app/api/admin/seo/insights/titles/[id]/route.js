import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { editTitle } from '@/lib/api/adminSeoInsights';

// Staff words for a page: kept as typed, and used by the website at once.
const EditRequest = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(320).nullable().optional(),
});

export const PATCH = withAdminSession(async ({ req, token, params }) => {
  const parsed = EditRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Type a title (15 to 65 characters) and, if you like, a description (70 to 160).' }, { status: 400 });
  }
  return NextResponse.json(await editTitle(token, params.id, parsed.data.title, parsed.data.description || null));
});
