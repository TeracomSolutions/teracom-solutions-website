import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchNextNewsBatch } from '@/lib/api/adminIndustryNews';

// The headlines the weekly article batch would draft if it ran now (Resources > Articles).
export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchNextNewsBatch(token)));
