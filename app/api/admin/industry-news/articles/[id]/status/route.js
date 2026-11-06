import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { setNewsArticleStatus } from '@/lib/api/adminIndustryNews';
import { NEWS_ARTICLES_TAG } from '@/lib/api/newsArticles';

const Body = z.object({ status: z.enum(['draft', 'published', 'rejected']) });

// Publish now, take back to draft (also unschedules), or reject; the Articles pages and the sitemap follow at once.
export const POST = withAdminSession(async ({ req, token, params }) => {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Unknown status.' }, { status: 400 });
  const saved = await setNewsArticleStatus(token, params.id, parsed.data.status);
  revalidateTag(NEWS_ARTICLES_TAG);
  revalidatePath('/resources/articles', 'layout');
  revalidatePath('/sitemap.xml');
  return NextResponse.json(saved);
});
