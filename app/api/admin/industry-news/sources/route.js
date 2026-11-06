import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { saveNewsSources } from '@/lib/api/adminIndustryNews';
import { NEWS_SOURCES_TAG } from '@/lib/newsSources';

// Saves the Industry news publications (Resources > Industry news); the news page and the
// homepage ticker pick the new list up straight away.
export const PUT = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.sources)) return NextResponse.json({ error: 'The list was not understood.' }, { status: 400 });
  const saved = await saveNewsSources(token, body.sources);
  revalidateTag(NEWS_SOURCES_TAG);
  revalidatePath('/resources/industry-news');
  revalidatePath('/');
  return NextResponse.json(saved);
});
