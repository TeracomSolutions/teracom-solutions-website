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
};
export default nextConfig;
