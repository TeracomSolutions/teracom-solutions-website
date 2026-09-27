import { BookOpen, FileText, Settings2, Wrench } from 'lucide-react';
import ResourceHero from '@/components/ResourceHero';
import { pageMetadata } from '@/lib/seo';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import { resourcesIntros } from '@/lib/resourcesIntros';
import PublishedDocuments from '@/components/PublishedDocuments';
import { fetchPublishedResources } from '@/lib/api/resources';

// The documents come from the console (Admin, Resources): staff publish the
// files the crawler collected, and this page lists them by brand.
export const metadata = pageMetadata({
  title: 'Installer Manuals | Teracom Solutions',
  description: 'Installation and commissioning manuals for the security systems Teracom Solutions supplies.',
  path: '/resources/installer-manuals',
});

export default async function InstallerManuals() {
  const listing = await fetchPublishedResources('installer-manuals');

  return (
    <main id="main-content">
      <ResourceHero title="Installer Manuals" icon={Wrench} badges={[FileText, Settings2, BookOpen]}>
        <p className="lead">Installation and commissioning manuals for the systems we supply.</p>
      </ResourceHero>
      <section className="section section-spacious">
        <div className="container">
          <div className="copy-block">
            {resourcesIntros['installer-manuals'].map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <ResourcesSubNav />
          <PublishedDocuments listing={listing} emptyMessage="Installer manuals are being added here." />
        </div>
      </section>
    </main>
  );
}
