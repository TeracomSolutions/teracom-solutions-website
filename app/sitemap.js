import { getBrands } from '@/lib/storeBrands';
import { categories } from '@/lib/categories';
import { getAllProducts } from '@/lib/catalogue';
import { aiCapabilities } from '@/lib/aiCapabilities';
import { articles } from '@/lib/articles';
import { fetchPublishedNewsArticles } from '@/lib/api/newsArticles';
import { resourcesSections } from '@/lib/resourcesSections';
import { services } from '@/lib/services';
import { monitoringServices } from '@/lib/monitoring';
import { ONLINE_FORMS } from '@/lib/onlineForms';
import { MONITORING_LOGIN_PATH, monitoringLoginEnabled } from '@/lib/monitoringLogin';
import { requestForms } from '@/lib/requestForms';
import { tools } from '@/lib/tools';
import { fetchDepartmentCatalogue } from '@/lib/api/departmentCatalogue';
import { NO_SAVINGS_PAGE } from '@/lib/savings';
import { absoluteUrl } from '@/lib/seo';
import { isAdminPath } from '@/lib/adminIndexing';
import { isThinProduct } from '@/lib/thinProducts';
import { growthOn, publishedItems } from '@/lib/api/growthPublic';

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
  { path: '/teracom-ai', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/store', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/store/specials', changeFrequency: 'daily', priority: 0.8 },
  { path: '/brands', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/monitoring', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/tools', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/tools/project', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/resources', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/warranty', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/acceptable-use', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
];

export default async function sitemap() {
  // Teracom AI: the savings page, the store section, and a page per pack and Department.
  let packs = [];
  try {
    packs = (await fetchDepartmentCatalogue()).entries;
  } catch {
    packs = [];
  }
  const products = await getAllProducts();
  // Area pages, projects and answered questions (Scout, Growth tools), while each tool is on.
  const growthEntries = [];
  for (const [tool, base, list] of [['service_areas', '/areas/', '/areas'], ['projects', '/projects/', '/projects'], ['questions', null, '/questions']]) {
    if (!(await growthOn(tool))) continue;
    const items = await publishedItems(tool);
    if (items.length === 0) continue;
    growthEntries.push({ path: list, changeFrequency: 'weekly', priority: 0.6 });
    if (base) growthEntries.push(...items.map((item) => ({ path: base + item.slug, changeFrequency: 'monthly', priority: 0.6 })));
  }
  const brands = await getBrands();
  const entries = [
    ...staticRoutes,

    // /resources/{datasheets,downloads,help-centre,product-videos,user-manuals}
    ...resourcesSections.map((section) => ({
      path: `/resources/${section.slug}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    })),

    // Articles, one page each under /resources/articles: our guides, then the published
    // articles from industry news.
    ...[...articles, ...(await fetchPublishedNewsArticles())].map((article) => ({
      path: `/resources/articles/${article.slug}`,
      changeFrequency: 'yearly',
      priority: 0.6,
    })),

    // Store category listings.
    ...categories.map((category) => ({
      path: `/store/${category.slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),

    // Per-product pages. Part-number searches are how trade buyers find a
    // supplier, so these are the store's highest-intent surface. A catalogue
    // product with no photo or description is left out until it has them
    // (lib/thinProducts.js): Google does not index thin pages.
    ...products.filter((product) => !isThinProduct(product)).map((product) => ({
      path: `/store/product/${product.id}`,
      changeFrequency: 'weekly',
      priority: 0.7,
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

    // Monitoring services -- the target for "alarm monitoring <city>" and
    // "back to base monitoring" searches.
    ...monitoringServices.map((service) => ({
      path: `/monitoring/${service.slug}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    // Pre-launch and switched off by default; listed only once it is turned on.
    ...(monitoringLoginEnabled() ? [{ path: MONITORING_LOGIN_PATH, changeFrequency: 'monthly', priority: 0.5 }] : []),
    // Forms customers sign (lib/onlineForms), only those that are live.
    ...ONLINE_FORMS.filter((form) => form.live).map((form) => ({ path: `/forms/${form.key}`, changeFrequency: 'monthly', priority: 0.4 })),

    ...[...requestForms, { slug: 'account-application' }].map((form) => ({
      path: `/resources/submit-a-request/${form.slug}`,
      changeFrequency: 'yearly',
      priority: 0.6,
    })),

    ...tools.map((tool) => ({
      path: `/tools/${tool.slug}`,
      changeFrequency: 'yearly',
      priority: 0.6,
    })),

    ...aiCapabilities.map((capability) => ({
      path: `/teracom-ai/${capability.slug}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),

    { path: '/teracom-ai/savings', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/store/teracom-ai', changeFrequency: 'weekly', priority: 0.8 },
    ...packs.map((p) => ({ path: `/store/teracom-ai/${p.slug}`, changeFrequency: 'weekly', priority: 0.6 })),
    ...packs
      .filter((p) => p.kind === 'department' && !NO_SAVINGS_PAGE.includes(p.slug))
      .map((p) => ({ path: `/teracom-ai/departments/${p.slug}`, changeFrequency: 'weekly', priority: 0.7 })),
    ...growthEntries,
  ];

  // Filter out admin paths to prevent them from appearing in sitemap
  const filteredEntries = entries.filter(entry => !isAdminPath(entry.path));

  return filteredEntries.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  }));
}
