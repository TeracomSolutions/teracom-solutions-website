import { NextResponse } from 'next/server';

import { staffMe } from '@/lib/api/adminAuth';
import { getCurrentCustomer } from '@/lib/api/customerAuth';
import { teraAsker } from '@/lib/teraSession';

// Whether the visitor is signed in (as a customer, or to the console), so
// the Ask Tera window can offer the chat or ask them to sign in. Read when
// the window opens, so pages stay cacheable.
export async function GET() {
  const asker = await teraAsker();
  if (!asker) return NextResponse.json({ signedIn: false });
  try {
    if (asker.kind === 'customer') {
      const customer = await getCurrentCustomer(asker.token);
      return NextResponse.json({ signedIn: true, firstName: customer?.first_name || '' });
    }
    await staffMe(asker.token);
    return NextResponse.json({ signedIn: true, firstName: '' });
  } catch {
    return NextResponse.json({ signedIn: false });
  }
}