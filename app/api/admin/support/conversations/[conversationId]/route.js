import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { getSupportConversation } from '@/lib/api/support';

export const GET = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await getSupportConversation(token, params.conversationId));
});
