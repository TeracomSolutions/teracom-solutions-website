import { NextResponse } from 'next/server';
import { getSignupCaptcha } from '@/lib/api/customerAuth';
import { ApiError } from '@/lib/api/client';
import { clientIpFromRequest } from '@/lib/rateLimit';

export async function GET(req) {
  try {
    const data = await getSignupCaptcha(clientIpFromRequest(req));
    return NextResponse.json(data);
  } catch (err) {
    const status = err instanceof ApiError ? err.status || 502 : 502;
    return NextResponse.json({ error: 'Unable to load the verification question.' }, { status });
  }
}