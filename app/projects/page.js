import { notFound } from 'next/navigation';

import { GrowthList } from '@/components/GrowthPage';
import { growthOn, publishedItems } from '@/lib/api/growthPublic';
import { pageMetadata } from '@/lib/seo';

// Finished jobs as case studies (growth tool 4). Only while the tool is on and at least one is published.
export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Projects | Teracom Solutions',
  description: 'Security, monitoring, access control and network projects Teracom Solutions has designed and installed.',
  path: '/projects',
});

export default async function ProjectsPage() {
  const items = (await growthOn('projects')) ? await publishedItems('projects') : [];
  if (items.length === 0) notFound();
  return (
    <GrowthList
      eyebrow="Projects"
      title="Work we are proud of."
      lead="Real jobs: what the customer needed, what we installed and how it turned out."
      items={items}
      base="/projects/"
    />
  );
}
