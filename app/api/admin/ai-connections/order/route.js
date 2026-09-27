import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { setAiOrder } from '@/lib/api/adminAiConnections';
import { z } from 'zod';

const schema = z.object({
  providers: z.array(z.string()).min(1).max(20),
});

export const PUT = withAdminSession(async ({ req, token }) => {
  const body = await req.json();
  const result = schema.safeParse(body);
  
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid providers array' }, { status: 400 });
  }
  
  try {
    await setAiOrder(token, result.data.providers);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});