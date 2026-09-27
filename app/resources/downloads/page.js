import { Download, FileArchive, HardDrive, Settings2 } from 'lucide-react';
import ResourceHero from '@/components/ResourceHero';
import { pageMetadata } from '@/lib/seo';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import { resourcesIntros } from '@/lib/resourcesIntros';
import PublishedDocuments from '@/components/PublishedDocuments';
import { fetchPublishedResources } from '@/lib/api/resources';

// The documents come from the console (Admin, Resources): staff publish the
// files the crawler collected, and this page lists them by brand.
export const metadata = pageMetadata({
  title: 'Software, Firmware & Downloads | Teracom Solutions',
  description: 'Software, firmware and supporting documents from Teracom Solutions.',
  path: '/resources/downloads',
});

export default async function Downloads() {
  const listing = await fetchPublishedResources('downloads');

  return (
    <main id="main-content">
      <ResourceHero title="Downloads" icon={Download} badges={[HardDrive, FileArchive, Settings2]}>
        <p className="lead">Software, firmware and supporting documents.</p>
      </ResourceHero>
      <section className="section section-spacious">
        <div className="container">
          <div className="copy-block">
            {resourcesIntros['downloads'].map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <ResourcesSubNav />
          <PublishedDocuments listing={listing} emptyMessage="Downloads are being added here." />
        </div>
      </section>
    </main>
  );
}
