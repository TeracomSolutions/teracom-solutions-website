import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { startAccountingConnect } from '@/lib/api/adminConnections';

// Connect to Xero, MYOB or QuickBooks: answers with the platform's sign-in address; the page sends the browser there.
export const POST = withAdminSession(async ({ token, params }) => NextResponse.json(await startAccountingConnect(token, params.key)));
