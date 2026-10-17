import { NextResponse } from 'next/server';

import { getCurrentCustomer } from '@/lib/api/customerAuth';
import { teraAsker } from '@/lib/teraSession';

// Whether the visitor is signed in as a customer, so the Ask Tera window can
// offer the chat or ask them to sign in. Read when the window opens, so pages
// stay cacheable.
export async function GET() {
  const asker = await teraAsker();
  if (!asker) return NextResponse.json({ signedIn: false });
  try {
    const customer = await getCurrentCustomer(asker.token);
    return NextResponse.json({ signedIn: true, firstName: customer?.first_name || '' });
  } catch {
    return NextResponse.json({ signedIn: false });
  }
}
