import { brands } from '@/lib/brands';
import { categories } from '@/lib/categories';
import { aiCapabilities } from '@/lib/aiCapabilities';
import { resourcesSections } from '@/lib/resourcesSections';
import { services } from '@/lib/services';
import { tools } from '@/lib/tools';
import { absoluteUrl } from '@/lib/seo';

// Next's native App Router sitemap convention (no next-sitemap dependency --
// the framework covers this on its own). Served at /sitemap.xml.
//
// Replaces the previous hand-rolled `app/sitemap.xml/route.js`, which had two
// real defects: it declared the urlset namespace as
// `https://www.sitemaps.org/schemas/sitemap/0.9` when the sitemap protocol
// specifies the `http://` form (a strict parser can reject the whole
// document), and it hardcoded the production origin in a template string, so
// preview deployments emitted production URLs. Letting Next serialise the XML
// fixes the first; deriving the origin from lib/seo.js fixes the second.
//
// Every URL is derived from the same data modules the pages themselves render
// from, so adding a brand, category or AI capability puts it in the sitemap
// automatically. A hardcoded URL list would silently rot the first time
// someone edits lib/brands.js.
//
// Deliberately excluded: /account*, /admin*, /cart and /checkout/* -- these are
// authenticated or transactional pages that carry a noindex directive (see
// lib/seo.js's NOINDEX). Listing a noindex URL in a sitemap sends Google
// contradictory signals and is reported as an error in Search Console.

// lastModified is intentionally omitted rather than stamped with the build
// time. A sitemap that claims every page changed on every deploy trains Google
// to distrust the field entirely; no value is more honest than a false one.
const staticRoutes = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/securityos-ai', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/store', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/brands', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/tools', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/resources', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/warranty', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
];

export default function sitemap() {
  const entries = [
    ...staticRoutes,

    // /resources/{datasheets,downloads,help-centre,product-videos,user-manuals}
    ...resourcesSections.map((section) => ({
      path: `/resources/${section.slug}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    })),

    // Store category listings -- the main commercial long-tail surface until
    // per-product pages exist.
    ...categories.map((category) => ({
      path: `/store/${category.slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),

    // Brand/manufacturer pages -- high relevance for "<brand> distributor
    // Australia" style queries.
    ...brands.map((brand) => ({
      path: `/brands/${brand.slug}`,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),

    // Service pages -- the main target for "<service> installation <city>" searches.
    ...services.map((service) => ({
      path: `/services/${service.slug}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),

    ...tools.map((tool) => ({
      path: `/tools/${tool.slug}`,
      changeFrequency: 'yearly',
      priority: 0.6,
    })),

    ...aiCapabilities.map((capability) => ({
      path: `/securityos-ai/${capability.slug}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
  ];

  return entries.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  }));
}
