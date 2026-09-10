import Link from 'next/link';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import DocumentList from '@/components/DocumentList';
import { downloads } from '@/lib/resourceDocuments';

export const metadata = {
  title: 'Downloads | Teracom Solutions',
  description: 'Software, firmware and supporting documents from Teracom Solutions.',
};

export default function Downloads() {
  return (
    <main>
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">
              <Link href="/resources" style={{ color: 'inherit' }}>
                &larr; Resources
              </Link>
            </span>
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
