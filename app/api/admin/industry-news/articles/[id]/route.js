import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { editNewsArticle } from '@/lib/api/adminIndustryNews';
import { NEWS_ARTICLES_TAG } from '@/lib/api/newsArticles';

const Changes = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  summary: z.string().max(400).optional(),
  body: z.string().min(1).max(20000).optional(),
});

export const PATCH = withAdminSession(async ({ req, token, params }) => {
  const parsed = Changes.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'The changes were not understood.' }, { status: 400 });
  const saved = await editNewsArticle(token, params.id, parsed.data);
  if (saved.status === 'published') {
    revalidateTag(NEWS_ARTICLES_TAG);
    revalidatePath('/resources/articles', 'layout');
  }
  return NextResponse.json(saved);
});
