// Server-only runtime configuration. Never import this from a 'use client' file:
// BACKEND_API_URL is intentionally not prefixed with NEXT_PUBLIC_ so it can never
// be inlined into the browser bundle.
//
// PLATFORM_SEPARATION_V1 -- this app now talks to its own dedicated
// teracom-website-backend (port 8002 by default), not teracom-ai-backend
// (the customer product's own backend, port 8000) -- see
// SD-021/SD-022/PLATFORM_SEPARATION_ASSESSMENT_V1 (teracom-ai-docs).
if (typeof window !== 'undefined') {
  throw new Error('lib/config.js must only be imported from server-side code.');
}

export const BACKEND_API_URL = (
  process.env.BACKEND_API_URL || 'http://localhost:8002'
).replace(/\/+$/, '');

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
