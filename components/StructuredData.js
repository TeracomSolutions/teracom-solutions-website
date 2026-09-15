import { SITE_ORIGIN, SITE_NAME, BUSINESS, absoluteUrl } from '@/lib/seo';

// Sitewide structured data. Rendered once from app/layout.js, so every page
// carries the Organization / LocalBusiness / WebSite graph; page-specific
// types (BreadcrumbList, Product, FAQPage, Service) are emitted by their own
// pages rather than being piled in here.
//
// The '@context' below is load-bearing: without it this block is not valid
// JSON-LD and Google discards the entire graph silently. It was missing until
// 2026-09-15, which meant none of this data -- address, phone, opening hours --
// had ever actually been readable by a search engine.
//
// Stable @id values let the nodes reference each other as one linked entity
// instead of looking like three unrelated businesses that happen to share a
// name.
const ORGANISATION_ID = `${SITE_ORIGIN}/#organisation`;
const LOCAL_BUSINESS_ID = `${SITE_ORIGIN}/#local-business`;
const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: BUSINESS.streetAddress,
  addressLocality: BUSINESS.addressLocality,
  addressRegion: BUSINESS.addressRegion,
  postalCode: BUSINESS.postalCode,
  addressCountry: BUSINESS.addressCountry,
};

export default function StructuredData() {
  const graph = [
    {
      '@type': 'Organization',
      '@id': ORGANISATION_ID,
      name: SITE_NAME,
      legalName: BUSINESS.legalName,
      taxID: BUSINESS.abn,
      identifier: {
        '@type': 'PropertyValue',
        name: 'ABN',
        value: BUSINESS.abn,
      },
      url: SITE_ORIGIN,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/assets/teracom-logo.png'),
      },
      address: postalAddress,
      email: BUSINESS.salesEmail,
      telephone: BUSINESS.telephone,
      // Links this site's entity to its verified social profiles -- one of the
      // few signals that reliably helps Google consolidate a brand's identity
      // into a single Knowledge Panel rather than several partial ones.
      sameAs: BUSINESS.sameAs,
      areaServed: [
        { '@type': 'Country', name: 'Australia' },
        { '@type': 'State', name: 'Victoria' },
        { '@type': 'State', name: 'New South Wales' },
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: BUSINESS.telephone,
          email: BUSINESS.salesEmail,
          areaServed: 'AU',
          availableLanguage: 'en-AU',
        },
        {
          '@type': 'ContactPoint',
          contactType: 'billing support',
          email: BUSINESS.accountsEmail,
          areaServed: 'AU',
          availableLanguage: 'en-AU',
        },
      ],
    },
    {
      '@type': 'LocalBusiness',
      '@id': LOCAL_BUSINESS_ID,
      name: SITE_NAME,
      url: SITE_ORIGIN,
      image: absoluteUrl('/assets/teracom-logo.png'),
      address: postalAddress,
      telephone: BUSINESS.telephone,
      email: BUSINESS.salesEmail,
      sameAs: BUSINESS.sameAs,
      parentOrganization: { '@id': ORGANISATION_ID },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: BUSINESS.openingHours.days,
          opens: BUSINESS.openingHours.opens,
          closes: BUSINESS.openingHours.closes,
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_ORIGIN,
      name: SITE_NAME,
      publisher: { '@id': ORGANISATION_ID },
      inLanguage: 'en-AU',
      // No 'potentialAction'/SearchAction here on purpose: the site has no
      // search route, and declaring a sitelinks search box that resolves to
      // nothing is a structured-data error, not a free win. Add it when a real
      // /search page exists.
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
