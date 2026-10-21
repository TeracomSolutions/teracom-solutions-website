import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { fetchZohoFlow, saveZohoFlow } from '@/lib/api/adminZohoFlow';

const FlowRequest = z.object({
  flow_enabled: z.boolean().optional(),
  writes_enabled: z.boolean().optional(),
  mode: z.enum(['preview', 'test']).optional(),
  functions: z.record(z.string().max(40), z.boolean()).optional(),
});

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchZohoFlow(token)));

export const PUT = withAdminSession(async ({ req, token }) => {
  const parsed = FlowRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'That setting was not understood.' }, { status: 400 });
  }
  return NextResponse.json(await saveZohoFlow(token, parsed.data));
});
