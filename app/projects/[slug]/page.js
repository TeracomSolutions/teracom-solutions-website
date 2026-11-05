import { notFound } from 'next/navigation';

import GrowthPage from '@/components/GrowthPage';
import { growthOn, publishedItem } from '@/lib/api/growthPublic';
import { SITE_ORIGIN, absoluteUrl, pageMetadata } from '@/lib/seo';

// One project case study (growth tool 4).
export const revalidate = 300;

async function load(slug) {
  if (!(await growthOn('projects'))) return null;
  return publishedItem('projects', slug);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await load(slug);
  if (!item) return {};
  return pageMetadata({
    title: `${item.title} | Teracom Solutions projects`,
    description: item.summary || item.title,
    path: `/projects/${item.slug}`,
  });
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const item = await load(slug);
  if (!item) notFound();
  const data = item.data || {};
  const photo = (data.photos || [])[0];
  return (
    <GrowthPage
      eyebrow="Project"
      item={item}
      facts={[{ label: 'Where', value: data.suburb }, { label: 'Installed', value: data.products }]}
      back={{ href: '/projects', label: 'All projects' }}
      schema={{
        '@type': 'Article',
        headline: item.title,
        description: item.summary || undefined,
        url: absoluteUrl(`/projects/${item.slug}`),
        datePublished: item.published_at || undefined,
        dateModified: item.updated_at || undefined,
        ...(photo ? { image: photo.url } : {}),
        author: { '@id': `${SITE_ORIGIN}/#organisation` },
        publisher: { '@id': `${SITE_ORIGIN}/#organisation` },
      }}
    />
  );
}
