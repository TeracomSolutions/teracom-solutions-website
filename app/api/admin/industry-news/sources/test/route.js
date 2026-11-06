import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { testNewsFeed } from '@/lib/api/adminIndustryNews';

const Body = z.object({
  feed: z.string().trim().min(8).max(500),
  host: z.string().trim().max(120).default(''),
  excludeTitle: z.string().max(200).default(''),
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Enter the feed link.' }, { status: 400 });
  return NextResponse.json(await testNewsFeed(token, parsed.data));
});
