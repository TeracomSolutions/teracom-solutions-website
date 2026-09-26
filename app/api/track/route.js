import { NextResponse } from 'next/server';
import { z } from 'zod';

import { recordPageView } from '@/lib/api/track';
import { clientIpFromRequest } from '@/lib/rateLimit';
import {
  deviceFromUserAgent,
  isBot,
  isTrackablePath,
  referrerHost,
  sydneyDay,
  visitorHash,
} from '@/lib/visitTracking';

// The first-party visit beacon. The browser sends only the path and the
// referrer; everything else is derived here, hashed, and forwarded to the
// backend. Always answers 204 -- a visitor's page must never wait on, or
// learn anything from, analytics.
const Body = z.object({
  path: z.string().min(1).max(500),
  referrer: z.string().max(2000).optional().default(''),
});

export async function POST(req) {
  const done = new NextResponse(null, { status: 204 });

  let body;
  try {
    body = Body.parse(await req.json());
  } catch {
    return done;
  }

  const userAgent = req.headers.get('user-agent') || '';
  if (!isTrackablePath(body.path) || isBot(userAgent)) return done;

  const salt = process.env.VISIT_HASH_SALT || process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || 'teracom';
  const view = {
    path: body.path,
    referrer_host: referrerHost(body.referrer, req.headers.get('host') || ''),
    country: (req.headers.get('x-vercel-ip-country') || '').slice(0, 2) || null,
    region: req.headers.get('x-vercel-ip-country-region') ? decodeURIComponent(req.headers.get('x-vercel-ip-country-region')).slice(0, 100) : null,
    device: deviceFromUserAgent(userAgent),
    visitor_hash: visitorHash({ ip: clientIpFromRequest(req), userAgent, day: sydneyDay(), salt }),
  };

  try {
    await recordPageView(view);
  } catch (error) {
    console.warn('Visit beacon not recorded', error instanceof Error ? error.message : error);
  }

  return done;
}
