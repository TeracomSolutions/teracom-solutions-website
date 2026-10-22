import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { createCodeRequest, fetchCodeRequests } from '@/lib/api/adminCodeRequests';

const NewRequest = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(15).max(3000),
});

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchCodeRequests(token)));

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = NewRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Give it a short title and describe the change in at least 15 characters.' }, { status: 400 });
  }
  return NextResponse.json(await createCodeRequest(token, parsed.data), { status: 201 });
});
