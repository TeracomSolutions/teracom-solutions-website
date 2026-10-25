import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { getAssistantChat, hideAssistantChat, renameAssistantChat } from '@/lib/api/adminAssistant';

const Id = z.string().uuid();
const Rename = z.object({ title: z.string().trim().min(1).max(200) });

async function chatId(params) {
  const parsed = Id.safeParse((await params)?.chatId);
  return parsed.success ? parsed.data : null;
}

export const GET = withAdminSession(async ({ token, params }) => {
  const id = await chatId(params);
  if (!id) return NextResponse.json({ error: 'That chat was not found.' }, { status: 404 });
  return NextResponse.json(await getAssistantChat(token, id));
});

export const PATCH = withAdminSession(async ({ req, token, params }) => {
  const id = await chatId(params);
  const parsed = Rename.safeParse(await req.json().catch(() => null));
  if (!id || !parsed.success) return NextResponse.json({ error: 'Give the chat a name.' }, { status: 400 });
  return NextResponse.json(await renameAssistantChat(token, id, parsed.data.title));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  const id = await chatId(params);
  if (!id) return NextResponse.json({ error: 'That chat was not found.' }, { status: 404 });
  return NextResponse.json(await hideAssistantChat(token, id));
});
