// Server-only. The home page banner as staff keep it on the console (Resources > Home banner, backend
// api/home_banner.py), laid over the banner built into lib/heroSlides.js, which is what shows whenever the
// backend cannot be reached or nothing has been saved.
if (typeof window !== 'undefined') {
  throw new Error('lib/homeBanner.js must only be used on the server.');
}

import { backendFetch } from './api/client.js';
import { defaultBanner, mergeBanner } from './heroSlides.js';

export const HOME_BANNER_TAG = 'home-banner';

export async function getHomeBanner() {
  try {
    const data = await backendFetch('/internal/home-banner', {
      revalidate: 3600,
      tags: [HOME_BANNER_TAG],
      headers: { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' },
    });
    return mergeBanner(data?.banner);
  } catch {
    return defaultBanner();
  }
}
