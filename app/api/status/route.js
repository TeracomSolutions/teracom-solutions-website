import { NextResponse } from 'next/server';
import { BACKEND_API_URL } from '@/lib/config';
import { GA_MEASUREMENT_ID, GOOGLE_SITE_VERIFICATION } from '@/lib/analytics';
import { FEED_HEADERS, NEWS_SOURCES, getSourceNews } from '@/lib/industryNews';
import { BUSINESS, SITE_ORIGIN } from '@/lib/seo';
import { services } from '@/lib/services';
import { brands } from '@/lib/brands';
import { tools } from '@/lib/tools';
import { products } from '@/lib/products';
import sitemap from '@/app/sitemap';

// "Website intelligence" feed for the Teracom AI platform: everything the
// website runs on its own -- schedules, news feeds, integrations -- and
// whether each is working right now. Public by design, so it only ever
// reports yes/no, counts and timestamps: never keys, tokens or customer data.
export const dynamic = 'force-dynamic';

const SCHEDULES = [
  { id: 'industry-news', what: `Industry news feeds (${NEWS_SOURCES.length} publishers)`, schedule: 'Hourly -- cached feeds refresh on the first visit after an hour' },
  { id: 'deploy', what: 'Website deploys (Vercel)', schedule: 'Automatic on every merge to main' },
  { id: 'ci', what: 'Lint, tests and build (GitHub Actions)', schedule: 'Every pull request and every merge to main' },
  { id: 'dependency-alerts', what: 'Dependency security alerts (GitHub Dependabot)', schedule: 'Continuous' },
  { id: 'sitemap', what: 'Sitemap (submitted to Google Search Console)', schedule: 'Rebuilt on every deploy; Google re-reads it periodically' },
  { id: 'analytics', what: 'Google Analytics 4', schedule: 'Real time, on every page view' },
];

async function checkBackend() {
  const started = Date.now();
  try {
    const res = await fetch(`${BACKEND_API_URL}/healthz`, { cache: 'no-store', signal: AbortSignal.timeout(4000) });
    return { reachable: res.ok, httpStatus: res.status, latencyMs: Date.now() - started };
  } catch {
    return { reachable: false, httpStatus: null, latencyMs: null };
  }
}

// For a feed that came back empty, ask the publisher directly (uncached) so
// the status shows why -- e.g. a firewall answering 403 to cloud servers.
async function probeFeed(feed) {
  try {
    const res = await fetch(feed, { cache: 'no-store', headers: FEED_HEADERS, signal: AbortSignal.timeout(6000) });
    return { httpStatus: res.status, contentType: res.headers.get('content-type'), server: res.headers.get('server') };
  } catch (error) {
    return { httpStatus: null, error: error?.name || 'fetch failed' };
  }
}

async function checkFeeds() {
  const lists = await Promise.all(NEWS_SOURCES.map((s) => getSourceNews(s, 20)));
  return Promise.all(
    NEWS_SOURCES.map(async (s, i) => {
      const items = lists[i];
      const newest = items.map((it) => it.date).filter(Boolean).sort().pop() || null;
      const sourceUsed = items[0]?.source || null;
      const usingFallback = Boolean(sourceUsed && sourceUsed !== s.source);
      const entry = { id: s.id, industry: s.label, source: s.source, feed: s.feed, ok: items.length > 0, items: items.length, newest, sourceUsed, usingFallback };
      // Probe the primary whenever it isn't the one serving stories.
      return items.length && !usingFallback ? entry : { ...entry, probe: await probeFeed(s.feed) };
    })
  );
}

export async function GET() {
  const [backend, feeds] = await Promise.all([checkBackend(), checkFeeds()]);
  const pages = (await sitemap()).length;

  const checks = {
    backend: backend.reachable,
    newsFeeds: feeds.every((f) => f.ok),
    googleAnalytics: Boolean(GA_MEASUREMENT_ID),
    searchConsoleVerification: Boolean(GOOGLE_SITE_VERIFICATION),
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    zoho: Boolean(process.env.ZOHO_REFRESH_TOKEN && process.env.ZOHO_ORGANIZATION_ID),
  };

  const body = {
    version: 1,
    site: SITE_ORIGIN,
    generatedAt: new Date().toISOString(),
    overall: Object.values(checks).every(Boolean) ? 'ok' : 'attention',
    checks,
    deploy: {
      commit: (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7) || null,
      message: (process.env.VERCEL_GIT_COMMIT_MESSAGE || '').split('\n')[0] || null,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || null,
    },
    schedules: SCHEDULES,
    newsFeeds: feeds,
    integrations: {
      backend: {
        ...backend,
        powers: 'Contact form, customer sign-up and sign-in, member pricing',
      },
      googleAnalytics: { configured: checks.googleAnalytics, measurementId: GA_MEASUREMENT_ID || null },
      googleSearchConsole: { verificationTagPresent: checks.searchConsoleVerification, sitemap: `${SITE_ORIGIN}/sitemap.xml` },
      googleBusinessProfile: { url: BUSINESS.googleBusinessUrl || null },
      stripe: { configured: checks.stripe, powers: 'Store checkout' },
      zoho: { configured: checks.zoho, powers: 'Invoices and contacts after a store order' },
      askTera: { enabled: process.env.NEXT_PUBLIC_ASK_TERA_ENABLED === 'true' },
    },
    content: {
      sitemapPages: pages,
      services: services.length,
      brands: brands.length,
      freeTools: tools.length,
      storeProducts: products.length,
    },
  };

  return NextResponse.json(body, {
    headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' },
  });
}
