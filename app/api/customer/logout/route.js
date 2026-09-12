import { NextResponse } from 'next/server';

import { clearCustomerSessionCookies } from '@/lib/customerSession';

// Teracom Solutions Website Customer Authentication, Phase 2.
// No backend call (Phase 1 backend has no logout/token-revocation endpoint --
// confirmed, do not invent one). Just clear the cookie.
//
// Redirects rather than returning JSON: this route is only ever hit via a
// plain <form method="POST"> (app/account/page.js's Sign out button, a real
// browser navigation, not a fetch() call) -- returning JSON here would leave
// the customer looking at raw {"ok":true} text instead of going anywhere.
// Same plain-form-POST-redirects convention as app/api/leads/route.js.
export async function POST(req) {
  return clearCustomerSessionCookies(NextResponse.redirect(new URL('/', req.url), 303));
}
