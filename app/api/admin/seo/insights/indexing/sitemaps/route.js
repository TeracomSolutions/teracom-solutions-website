import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchSitemaps, submitSitemap } from '@/lib/api/adminSeoInsights';

// What Google says about the sitemaps submitted for the website.
export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchSitemaps(token)));

// Tell Google about the sitemap again.
export const POST = withAdminSession(async ({ token }) => NextResponse.json(await submitSitemap(token)));
