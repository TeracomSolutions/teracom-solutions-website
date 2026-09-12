import { NextResponse } from 'next/server';
import { getSignupCaptcha } from '@/lib/api/customerAuth';
import { ApiError } from '@/lib/api/client';

export async function GET() {
  try {
    const data = await getSignupCaptcha();
    return NextResponse.json(data);
  } catch (err) {
    const status = err instanceof ApiError ? err.status || 502 : 502;
    return NextResponse.json({ error: 'Unable to load the verification question.' }, { status });
  }
}