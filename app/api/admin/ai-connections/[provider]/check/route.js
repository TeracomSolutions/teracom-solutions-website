import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { checkAiProvider } from '@/lib/api/adminAiConnections';

export const POST = withAdminSession(async ({ req, token, params }) => {
  const { provider } = params;
  
  try {
    const result = await checkAiProvider(token, provider);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});