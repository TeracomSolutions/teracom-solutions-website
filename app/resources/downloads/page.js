import { Download, FileArchive, HardDrive, Settings2 } from 'lucide-react';
import ResourceHero from '@/components/ResourceHero';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import { resourcesIntros } from '@/lib/resourcesIntros';
import DocumentList from '@/components/DocumentList';
import { downloads } from '@/lib/resourceDocuments';

export const metadata = pageMetadata({
  title: 'Software, Firmware & Downloads | Teracom Solutions',
  description: 'Software, firmware and supporting documents from Teracom Solutions.',
  path: '/resources/downloads',
});

export default function Downloads() {
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
          <DocumentList documents={downloads} emptyMessage="Downloads are being added here." />
        </div>
      </section>
    </main>
  );
}
