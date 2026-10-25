import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { listAssistantChats } from '@/lib/api/adminAssistant';

// This person's saved Assistant chats, newest first; ?q= searches titles and messages.
export const GET = withAdminSession(async ({ req, token }) => {
  const q = (new URL(req.url).searchParams.get('q') || '').slice(0, 100);
  return NextResponse.json(await listAssistantChats(token, q));
});
