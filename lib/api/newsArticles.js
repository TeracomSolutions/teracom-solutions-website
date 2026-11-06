// Server-only. Published articles from industry news (backend api/industry_news.py),
// cached for an hour and refreshed at once when staff publish or edit one.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/newsArticles.js must only be used on the server.');
}

import { backendFetch } from './client.js';
import { articleFromNews } from '../newsArticles.js';

export const NEWS_ARTICLES_TAG = 'news-articles';

const service = () => ({ 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' });

/** Published articles, newest first, as list items (no body). Empty when the backend cannot be reached. */
export async function fetchPublishedNewsArticles() {
  try {
    const data = await backendFetch('/internal/industry-news/articles', { revalidate: 3600, tags: [NEWS_ARTICLES_TAG], headers: service() });
    return (data?.articles || []).map(articleFromNews).filter(Boolean);
  } catch {
    return [];
  }
}

/** One published article, or null. */
export async function fetchPublishedNewsArticle(slug) {
  if (!/^[a-z0-9-]{1,120}$/.test(String(slug || ''))) return null;
  try {
    const row = await backendFetch(`/internal/industry-news/articles/${encodeURIComponent(slug)}`, {
      revalidate: 3600,
      tags: [NEWS_ARTICLES_TAG],
      headers: service(),
    });
    return articleFromNews(row);
  } catch {
    return null;
  }
}
