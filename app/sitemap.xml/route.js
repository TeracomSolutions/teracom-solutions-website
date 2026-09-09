import { categories } from '@/lib/categories';

const staticPages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/securityos-ai', changefreq: 'weekly', priority: '0.9' },
  { path: '/store', changefreq: 'weekly', priority: '0.8' },
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

  const urls = [...staticPages, ...categoryPages]
    .map(
      (p) =>
        `<url><loc>https://www.teracomsolutions.com.au${p.path}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, { headers: { 'content-type': 'application/xml' } });
}
