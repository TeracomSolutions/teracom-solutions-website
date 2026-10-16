// Server-only. Who is asking Tera: a customer signed in to the website. Ask
// Tera is about the website only (Robert, 2026-10-17), so a staff sign-in to
// the console does not count. voiceAsker is the wider check the read-aloud
// route uses, because the console Assistant speaks through it too.
if (typeof window !== 'undefined') {
  throw new Error('lib/teraSession.js must only be used on the server.');
}

import { cookies } from 'next/headers';

import { adminSessionToken } from '@/lib/adminApi';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';

// { kind: 'customer', token } or null when no customer is signed in.
export async function teraAsker() {
  const customerToken = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  return customerToken ? { kind: 'customer', token: customerToken } : null;
}

// { kind: 'customer' | 'staff', token } or null when nobody is signed in. A
// customer session wins when there are both.
export async function voiceAsker() {
  const asker = await teraAsker();
  if (asker) return asker;
  const staffToken = await adminSessionToken();
  return staffToken ? { kind: 'staff', token: staffToken } : null;
}
