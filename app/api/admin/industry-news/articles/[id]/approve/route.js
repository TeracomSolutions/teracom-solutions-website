import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { approveNewsArticle } from '@/lib/api/adminIndustryNews';

// Approve a draft: it takes the next publishing time (and its Post it share, if sharing is on).
// The backend's scheduler publishes it then; nothing on the website changes yet.
export const POST = withAdminSession(async ({ token, params }) => NextResponse.json(await approveNewsArticle(token, params.id)));
