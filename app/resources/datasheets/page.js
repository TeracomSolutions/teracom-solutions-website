import Link from 'next/link';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import DocumentList from '@/components/DocumentList';
import { datasheets } from '@/lib/resourceDocuments';

export const metadata = {
  title: 'Datasheets | Teracom Solutions',
  description: 'Technical specification sheets for the Teracom Solutions product range.',
};

export default function Datasheets() {
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
            <h1>Datasheets</h1>
            <p className="lead">Technical specification sheets for our product range.</p>
          </div>
        </div>
      </section>
      <section className="section section-spacious">
        <div className="container">
          <ResourcesSubNav />
          <DocumentList documents={datasheets} emptyMessage="Datasheets are being added here." />
        </div>
      </section>
    </main>
  );
}
