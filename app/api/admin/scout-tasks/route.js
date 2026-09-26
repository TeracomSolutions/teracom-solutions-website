import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import {
  createScoutTask,
  fetchActiveScoutTasks,
  fetchRecurringScoutTasks,
  fetchScoutTaskHistory,
} from '@/lib/api/adminScout';

const SECTIONS = ['website_intelligence', 'operating_systems'];

const LISTS = {
  active: fetchActiveScoutTasks,
  recurring: fetchRecurringScoutTasks,
  history: fetchScoutTaskHistory,
};

const CreateRequest = z.object({
  section: z.enum(SECTIONS),
  title: z.string().trim().min(1).max(200),
  target: z.string().trim().max(2000).optional().nullable(),
  recurrence: z.enum(['once', 'daily', 'weekly', 'monthly']),
});

// GET ?view=active|recurring|history&section=...
export const GET = withAdminSession(async ({ req, token }) => {
  const { searchParams } = new URL(req.url);
  const list = LISTS[searchParams.get('view')];
  const section = searchParams.get('section');

  if (!list || !SECTIONS.includes(section)) {
    return NextResponse.json({ error: 'Unknown view or section' }, { status: 400 });
  }

  return NextResponse.json(await list(token, section));
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = CreateRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please give the task a title and a recurrence.' }, { status: 400 });
  }

  const { section, title, target, recurrence } = parsed.data;
  const task = await createScoutTask(token, { section, title, target: target || null, recurrence });
  return NextResponse.json(task, { status: 201 });
});
