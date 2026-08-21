import { NextResponse } from 'next/server';
import { z } from 'zod';

import { parseFeed } from '@/lib/feed-importer';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';
import { isValidImportToken } from '@/lib/adminAuth';

// Defense-in-depth against brute-forcing ADMIN_IMPORT_TOKEN (flagged in
// Repository_Audit_Decision_Memo_V1.md item 6) -- the token itself is the
// real control (now compared in constant time, see isValidImportToken
// below); this just bounds how many guesses a given IP gets per window.
// Generous relative to real admin usage (occasional feed imports, not a
// high-frequency workflow), tight relative to a brute-force attempt.
const ADMIN_IMPORT_RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.ADMIN_IMPORT_RATE_LIMIT_MAX_ATTEMPTS) || 20;
const ADMIN_IMPORT_RATE_LIMIT_WINDOW_MS = (Number(process.env.ADMIN_IMPORT_RATE_LIMIT_WINDOW_SECONDS) || 3600) * 1000;

const ImportRequest = z.object({
  token: z.string(),
  type: z.enum(['csv', 'json', 'xml']),
  content: z.string(),
});

export async function POST(req) {
  const rateLimitKey = `admin-import:${clientIpFromRequest(req)}`;
  const rateLimit = checkRateLimit(rateLimitKey, {
    maxAttempts: ADMIN_IMPORT_RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: ADMIN_IMPORT_RATE_LIMIT_WINDOW_MS,
  });
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds, 'Too many import attempts. Please try again later.');
  }

  const parsed = ImportRequest.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid import request' }, { status: 400 });
  }

  if (!isValidImportToken(parsed.data.token, process.env.ADMIN_IMPORT_TOKEN)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const products = parseFeed(parsed.data.content, parsed.data.type);
  return NextResponse.json({ imported: products.length, products });
}
