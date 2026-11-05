import { notFound } from 'next/navigation';

import GrowthPage from '@/components/GrowthPage';
import { growthOn, publishedItem } from '@/lib/api/growthPublic';
import { SITE_ORIGIN, absoluteUrl, pageMetadata } from '@/lib/seo';

// One area Teracom covers (growth tool 3).
export const revalidate = 300;

async function load(slug) {
  if (!(await growthOn('service_areas'))) return null;
  return publishedItem('service_areas', slug);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await load(slug);
  if (!item) return {};
  return pageMetadata({
    title: `Security and network installation in ${item.title} | Teracom Solutions`,
    description: item.summary || `CCTV, alarms, access control, intercoms and networks installed in ${item.title} by Teracom Solutions.`,
    path: `/areas/${item.slug}`,
  });
}

export default async function AreaPage({ params }) {
  const { slug } = await params;
  const item = await load(slug);
  if (!item) notFound();
  const data = item.data || {};
  return (
    <GrowthPage
      eyebrow="Area we cover"
      item={item}
      facts={[{ label: 'Suburbs', value: data.suburbs }, { label: 'Services', value: data.services }]}
      back={{ href: '/areas', label: 'All areas' }}
      schema={{
        '@type': 'Service',
        name: `Security and network installation in ${item.title}`,
        description: item.summary || undefined,
        url: absoluteUrl(`/areas/${item.slug}`),
        areaServed: { '@type': 'Place', name: item.title },
        provider: { '@id': `${SITE_ORIGIN}/#local-business` },
      }}
    />
  );
}
