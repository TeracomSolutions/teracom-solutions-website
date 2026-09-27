import { BookOpen, Bookmark, FileText, Ruler } from 'lucide-react';
import ResourceHero from '@/components/ResourceHero';
import { pageMetadata } from '@/lib/seo';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import { resourcesIntros } from '@/lib/resourcesIntros';
import PublishedDocuments from '@/components/PublishedDocuments';
import { fetchPublishedResources } from '@/lib/api/resources';

// The documents come from the console (Admin, Resources): staff publish the
// files the crawler collected, and this page lists them by brand.
export const metadata = pageMetadata({
  title: 'Product Brochures | Teracom Solutions',
  description: 'Product brochures and range overviews from the manufacturers Teracom Solutions works with.',
  path: '/resources/brochures',
});

export default async function Brochures() {
  const listing = await fetchPublishedResources('brochures');

  return (
    <main id="main-content">
      <ResourceHero title="Brochures" icon={BookOpen} badges={[FileText, Ruler, Bookmark]}>
        <p className="lead">Product brochures and range overviews from the manufacturers we work with.</p>
      </ResourceHero>
      <section className="section section-spacious">
        <div className="container">
          <div className="copy-block">
            {resourcesIntros['brochures'].map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <ResourcesSubNav />
          <PublishedDocuments listing={listing} emptyMessage="Brochures are being added here." />
        </div>
      </section>
    </main>
  );
}
