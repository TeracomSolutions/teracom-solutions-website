import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { keepSupportAnswer } from '@/lib/api/support';

// Keep this answer: one of Tera's replies becomes something it has learned.
export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await keepSupportAnswer(token, params.messageId));
});
