import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { sendLeadReply } from '@/lib/api/adminLeads';

// Send the reply (Tera's draft as staff left it) to the person by email.
const ReplyRequest = z.object({
  text: z.string().trim().min(1).max(8000),
});

export const POST = withAdminSession(async ({ req, token, params }) => {
  const parsed = ReplyRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Write a reply of up to 8,000 characters.' }, { status: 400 });
  }
  return NextResponse.json(await sendLeadReply(token, params.leadId, parsed.data.text));
});