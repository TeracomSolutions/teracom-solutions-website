import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { startZohoConnect } from '@/lib/api/adminConnections';

// Answers with the Zoho sign-in address; the page sends the browser there.
export const POST = withAdminSession(async ({ token }) => NextResponse.json(await startZohoConnect(token)));