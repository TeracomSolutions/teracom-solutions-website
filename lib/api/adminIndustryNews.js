// Server-only. Industry news sources and the articles drafted from them -- the console's
// Resources > Industry news and Resources > Articles (backend api/industry_news.py).
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminIndustryNews.js must only be used on the server.');
}

import { backendFetch } from './client.js';

const BASE = '/staff/industry-news';

export const fetchNewsSourcesAdmin = (token) => backendFetch(`${BASE}/sources`, { token });
export const saveNewsSources = (token, sources) => backendFetch(`${BASE}/sources`, { method: 'PUT', token, body: { sources } });
export const testNewsFeed = (token, body) => backendFetch(`${BASE}/sources/test`, { method: 'POST', token, body });
export const fetchNewsHeadlines = (token) => backendFetch(`${BASE}/headlines`, { token });
export const fetchNextNewsBatch = (token) => backendFetch(`${BASE}/articles/next-batch`, { token });

export const fetchNewsArticlesAdmin = (token, status) =>
  backendFetch(`${BASE}/articles`, { token, searchParams: status ? { status } : undefined });
export const saveNewsArticleSettings = (token, body) => backendFetch(`${BASE}/articles/settings`, { method: 'PUT', token, body });
export const draftNewsArticle = (token, headline) => backendFetch(`${BASE}/articles/draft`, { method: 'POST', token, body: headline });
export const fetchNewsArticleAdmin = (token, id) => backendFetch(`${BASE}/articles/${encodeURIComponent(id)}`, { token });
export const editNewsArticle = (token, id, body) => backendFetch(`${BASE}/articles/${encodeURIComponent(id)}`, { method: 'PATCH', token, body });
export const approveNewsArticle = (token, id) =>
  backendFetch(`${BASE}/articles/${encodeURIComponent(id)}/approve`, { method: 'POST', token, body: {} });
export const setNewsArticleStatus = (token, id, status) =>
  backendFetch(`${BASE}/articles/${encodeURIComponent(id)}/status`, { method: 'POST', token, body: { status } });
