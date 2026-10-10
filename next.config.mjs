/** @type {import('next').NextConfig} */
const nextConfig = {
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
  async redirects() {
    return [
      { source: '/securityos-ai', destination: '/teracom-ai', permanent: true },
      { source: '/securityos-ai/:path*', destination: '/teracom-ai/:path*', permanent: true },
    ];
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