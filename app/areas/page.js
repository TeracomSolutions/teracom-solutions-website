import { notFound } from 'next/navigation';

import { GrowthList } from '@/components/GrowthPage';
import { growthOn, publishedItems } from '@/lib/api/growthPublic';
import { pageMetadata } from '@/lib/seo';

// The areas Teracom covers (growth tool 3). Only while the tool is on and at least one page is published.
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Areas we cover | Teracom Solutions',
  description: 'CCTV, alarms and monitoring, access control, intercoms, networks and data cabling installed and looked after by Teracom Solutions across these areas.',
  path: '/areas',
});

export default async function AreasPage() {
  const items = (await growthOn('service_areas')) ? await publishedItems('service_areas') : [];
  if (items.length === 0) notFound();
  return (
    <GrowthList
      eyebrow="Areas we cover"
      title="Security and networks, installed locally."
      lead="The areas our technicians work in every week. Choose yours to see what we do there."
      items={items}
      base="/areas/"
    />
  );
}
