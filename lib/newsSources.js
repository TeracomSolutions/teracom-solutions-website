// Server-only. The Industry news publications as staff keep them on the console
// (Resources > Industry news, backend api/industry_news.py), with the built-in list in
// lib/industryNews.js as the fallback whenever the backend cannot be reached or has none.
if (typeof window !== 'undefined') {
  throw new Error('lib/newsSources.js must only be used on the server.');
}

import { backendFetch } from './api/client.js';
import { NEWS_SOURCES, sourcesFromBackend } from './industryNews.js';

export const NEWS_SOURCES_TAG = 'industry-news-sources';

export async function getNewsSources() {
  try {
    const data = await backendFetch('/internal/industry-news/sources', {
      revalidate: 3600,
      tags: [NEWS_SOURCES_TAG],
      headers: { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' },
    });
    const list = sourcesFromBackend(data?.sources);
    return list.length ? list : NEWS_SOURCES;
  } catch {
    return NEWS_SOURCES;
  }
}
