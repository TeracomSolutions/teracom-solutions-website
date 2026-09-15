import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import Breadcrumbs from '@/components/Breadcrumbs';
import DocumentList from '@/components/DocumentList';
import { downloads } from '@/lib/resourceDocuments';

export const metadata = pageMetadata({
  title: 'Downloads | Teracom Solutions',
  description: 'Software, firmware and supporting documents from Teracom Solutions.',
  path: '/resources/downloads',
});

export default function Downloads() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <Breadcrumbs
              items={[{ name: 'Resources', href: '/resources' }]}
              current={'Downloads'}
            />
            <h1>Downloads</h1>
            <p className="lead">Software, firmware and supporting documents.</p>
          </div>
        </div>
      </section>
      <section className="section section-spacious">
        <div className="container">
          <ResourcesSubNav />
          <DocumentList documents={downloads} emptyMessage="Downloads are being added here." />
        </div>
      </section>
    </main>
  );
}
