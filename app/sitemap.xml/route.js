import { categories } from '@/lib/categories';
import { aiCapabilities } from '@/lib/aiCapabilities';
import { resourcesSections } from '@/lib/resourcesSections';
import { brands } from '@/lib/brands';

const staticPages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/securityos-ai', changefreq: 'weekly', priority: '0.9' },
  { path: '/store', changefreq: 'weekly', priority: '0.8' },
  { path: '/brands', changefreq: 'weekly', priority: '0.7' },
  { path: '/resources', changefreq: 'weekly', priority: '0.7' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/warranty', changefreq: 'monthly', priority: '0.4' },
  { path: '/terms', changefreq: 'monthly', priority: '0.3' },
];

export function GET() {
  const categoryPages = categories.map((c) => ({
    path: `/store/${c.slug}`,
    changefreq: 'weekly',
    priority: '0.7',
  }));

  const capabilityPages = aiCapabilities.map((c) => ({
    path: `/securityos-ai/${c.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
  }));

  const resourcesPages = resourcesSections.map((s) => ({
    path: `/resources/${s.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
  }));

  const brandPages = brands.map((b) => ({
    path: `/brands/${b.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
  }));

  const urls = [...staticPages, ...categoryPages, ...capabilityPages, ...resourcesPages, ...brandPages]
    .map(
      (p) =>
        `<url><loc>https://www.teracomsolutions.com.au${p.path}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, { headers: { 'content-type': 'application/xml' } });
}
