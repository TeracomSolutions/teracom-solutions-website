// Shared SEO primitives: the canonical origin, the single source of truth for
// Teracom's NAP (name/address/phone) data, and helpers that build consistent
// metadata objects so every page doesn't hand-roll its own canonical, Open
// Graph and Twitter block.
//
// Why the origin is defaulted here rather than read from lib/config.js's
// SITE_URL: that value defaults to http://localhost:3001 for local dev, and a
// sitemap or canonical tag emitting localhost URLs into production would be
// actively harmful (Google would index nothing, or index the wrong host). The
// default here is the real production origin, matching the metadataBase
// already hardcoded in app/layout.js; NEXT_PUBLIC_SITE_URL still overrides it
// for preview deployments.

export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.teracomsolutions.com.au'
).replace(/\/+$/, '');

export const SITE_NAME = 'Teracom Solutions';

// NAP -- kept identical to what's rendered in components/Footer.js,
// app/page.js's contact section and app/about/page.js's showroom block.
// Local ranking is sensitive to NAP mismatches between a page's visible text,
// its structured data, and third-party citations, so these must stay in sync;
// change them here and in those three places together, never just one.
export const BUSINESS = {
  name: SITE_NAME,
  legalName: 'Teracom Solutions Pty Ltd',
  // ABN as published in app/terms/page.js's own metadata description. A
  // verifiable company identifier is a real trust/E-E-A-T signal and lets
  // Google tie this site to the registered entity rather than treating it as
  // an unidentified brand.
  abn: '49 107 979 546',
  // Security licence numbers, shown in the footer beside the ABN. A
  // displayed licence number is the strongest trust signal available in
  // this industry and almost no online seller shows one -- but an empty
  // list renders nothing rather than a placeholder, because publishing an
  // unverified licence number would be far worse than publishing none.
  // Populate as { state, number } once Robert confirms them.
  securityLicences: [],
  streetAddress: '1B Yazaki Way',
  addressLocality: 'Carrum Downs',
  addressRegion: 'VIC',
  postalCode: '3201',
  addressCountry: 'AU',
  telephone: '+61397082685',
  telephoneDisplay: '+61 3 9708 2685',
  salesEmail: 'sales@teracomsolutions.com.au',
  // Where service and password-reset requests go. Deliberately used in
  // place of the phone number on the request pages (Robert, 2026-09-23):
  // a form that gets answered beats a call that interrupts a job.
  supportEmail: 'support@teracomsolutions.com.au',
  // Weekdays 9am - 4:30pm, weekends closed (confirmed by Robert 2026-09-22 and
  // matching the Google Business Profile). Also written out on /about,
  // /contact, the contact form and llms.txt -- change them together.
  openingHours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '16:30',
  },
  // Google Business Profile (Maps listing 'Teracom Solutions Pty Ltd', CID from
  // its Maps URL). Used for the Google reviews link on /contact.
  googleBusinessUrl: 'https://maps.google.com/?cid=16766847199396618175',
  // Matches the social links already rendered in components/Footer.js, plus
  // the Google Business Profile.
  sameAs: [
    'https://maps.google.com/?cid=16766847199396618175',
    'https://www.facebook.com/teracomsolutions.com.au',
    'https://www.instagram.com/teracom_solutions/',
    'https://www.linkedin.com/company/11855559/',
    'https://www.youtube.com/@teracomsolutions1713',
  ],
};

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Build a page's metadata with a canonical URL and matching Open Graph /
 * Twitter card. Every indexable page should go through here so the three never
 * drift apart -- a canonical that disagrees with og:url is a common and
 * entirely self-inflicted indexing problem.
 */
export function pageMetadata({ title, description, path, type = 'website', images }) {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_AU',
      type,
      ...(images ? { images } : { images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Teracom Solutions' }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(images ? { images } : { images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Teracom Solutions' }] }),
    },
  };
}

/**
 * For pages that must never appear in search results -- authenticated areas,
 * the cart, and checkout outcome pages. robots.txt alone is not enough: a
 * Disallow'd URL can still be indexed (without a snippet) if something links
 * to it, so the directive has to be on the page itself.
 */
export const NOINDEX = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};
