import { execSync } from 'node:child_process';

// Which commit this build is and when it was made (shown on the About page). Vercel supplies the
// commit; elsewhere it is read from git.
function buildCommit() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA;
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { BUILD_COMMIT: buildCommit(), BUILD_TIME: new Date().toISOString() },
  reactStrictMode: true,
  // next/image's optimizer rejects local SVGs by default (400 at request
  // time even though the build itself doesn't catch it) -- the five files
  // under public/assets/*.svg need this. contentSecurityPolicy is Next's
  // own documented safe default for this: sandboxes the SVG response so it
  // can't execute scripts, same effect as any other static asset.
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  poweredByHeader: false,
  // The AI pages used to live at /securityos-ai. Anyone arriving at the old
  // address, and Google, is sent to the new one with a permanent redirect.
  // The console's Search area was merged into Website Data and its old
  // addresses are sent to the new ones.
  async redirects() {
    return [
      { source: '/securityos-ai', destination: '/teracom-ai', permanent: true },
      { source: '/securityos-ai/:path*', destination: '/teracom-ai/:path*', permanent: true },
      { source: '/admin/seo', destination: '/admin/website-data', permanent: true },
      // The camera-only planner grew into the site plan designer (2026-11-02).
      { source: '/tools/camera-plan-designer', destination: '/tools/site-plan-designer', permanent: true },
      { source: '/admin/seo/:path*', destination: '/admin/website-data/:path*', permanent: true },
      // The placeholder products were removed (2026-11-05); their old pages go to the store.
      { source: '/store/product/sample-reader', destination: '/store', permanent: true },
      { source: '/store/product/motion-detector', destination: '/store', permanent: true },
      { source: '/store/product/door-window-sensor', destination: '/store', permanent: true },
      { source: '/store/product/sow-template-pack', destination: '/store', permanent: true },
      { source: '/store/product/design-review', destination: '/store', permanent: true },
      { source: '/store/product/system-integration', destination: '/store', permanent: true },
    ];
  },
  // The IndexNow key file (Scout, Growth tools): /<32 hex>.txt is answered by a route.
  async rewrites() {
    return [{ source: '/:key([0-9a-f]{32}).txt', destination: '/api/indexnow-key/:key' }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // The microphone is allowed for this site only: the admin
          // Assistant takes spoken questions. Camera and location stay off.
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=()',
          },
          // A Content-Security-Policy that cannot break the pages: no
          // framing by other sites and no <base> or plugin injection.
          // Scripts and styles are not restricted here (Turnstile, Google Maps
          // and analytics load from other origins); tighten that with nonces
          // later.
          // Which sites may supply scripts, frames and connections, reported in the
          // browser console but not enforced yet (security review 2026-11-06): it is
          // switched to enforced once the live site shows no reports.
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://js.stripe.com https://challenges.cloudflare.com https://www.googletagmanager.com https://connect.facebook.net https://maps.googleapis.com https://va.vercel-scripts.com",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com https://www.google.com https://maps.google.com https://www.youtube.com https://www.youtube-nocookie.com",
              "connect-src 'self' https://api.stripe.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://challenges.cloudflare.com https://maps.googleapis.com https://vitals.vercel-insights.com",
              "img-src 'self' data: blob: https:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "media-src 'self' blob: data:",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "object-src 'none'",
              "form-action 'self' https://checkout.stripe.com",
            ].join('; '),
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
          },
        ],
      },
      // Add X-Robots-Tag headers for admin paths to ensure they're not indexed
      {
        source: "/admin/:path*",
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
    ];
  },
};

export default nextConfig;