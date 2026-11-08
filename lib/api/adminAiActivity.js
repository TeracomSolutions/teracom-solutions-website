// Server-only. The AI activity page: every AI call and web search, api/staff_ai_activity.py on the website backend, staff bearer token

import { backendFetch } from './client.js';

const BASE = '/staff/ai-activity';
export async function fetchAiActivity(token, days = 1, area = '', provider = '') {
  return backendFetch(BASE, { token, searchParams: { days, area, provider } });
}