import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { draftNewsArticle } from '@/lib/api/adminIndustryNews';

const Headline = z.object({
  title: z.string().trim().min(3).max(300),
  link: z.string().trim().url().max(600),
  summary: z.string().max(1000).default(''),
  publication: z.string().max(80).default(''),
  industry: z.string().max(60).default(''),
});

// Draft one now: one article from a chosen headline. The AI connections write it, which
// takes up to a minute.
export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = Headline.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Choose a headline.' }, { status: 400 });
  return NextResponse.json(await draftNewsArticle(token, parsed.data));
});

export const maxDuration = 120;
