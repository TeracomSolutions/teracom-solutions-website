import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { saveWebsiteResult, testConnection } from '@/lib/api/adminConnections';
import { testWebsiteConnection, WEBSITE_TESTS } from '@/lib/websiteConnections';

// Stripe and Turnstile keys live in the website's own settings, so the
// website tests those itself; everything else is tested by the backend.
export const POST = withAdminSession(async ({ token, params }) => {
  if (WEBSITE_TESTS.includes(params.key)) {
    const result = await testWebsiteConnection(params.key);
    // Only status, message and time are stored, never a key
    await saveWebsiteResult(token, params.key, result).catch(() => {});
    return NextResponse.json(result);
  }
  return NextResponse.json(await testConnection(token, params.key));
}, { verify: true });
