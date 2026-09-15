import { absoluteUrl, SITE_ORIGIN } from '@/lib/seo';

// Served at /robots.txt via Next's App Router convention.
//
// Replaces the previous `app/robots.txt/route.js`, which allowed everything
// except `/admin/` and `/private/` -- and `/private/` is not a route that has
// ever existed on this site, while `/account/`, `/cart`, `/checkout/` and
// `/api/` (all of which genuinely should not be crawled) were left open.
//
// Crawler policy: AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
// Google-Extended, CCBot) are deliberately NOT blocked. Assistant-generated
// answers are a real and growing discovery channel, and a company selling an
// AI platform has an obvious interest in being present in them. Blocking them
// would protect content that is already public while removing Teracom from
// that channel entirely. If this position is ever reversed, add the
// user-agent-specific disallow rules here and record the decision -- an
// omission is invisible to the next person otherwise.

const disallow = [
  '/api/',       // route handlers -- never useful in an index
  '/admin/',     // staff catalogue administration
  '/account/',   // authenticated customer area
  '/cart',
  '/checkout/',  // includes /checkout/success, which can carry order context
];

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_ORIGIN,
  };
}
