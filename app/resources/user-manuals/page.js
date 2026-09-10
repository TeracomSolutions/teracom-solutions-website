import Link from 'next/link';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import DocumentList from '@/components/DocumentList';
import { manuals } from '@/lib/resourceDocuments';

export const metadata = {
  title: 'User Manuals | Teracom Solutions',
  description: 'Product manuals for the systems and equipment Teracom Solutions supplies and installs.',
};

export default function UserManuals() {
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
            <h1>User Manuals</h1>
            <p className="lead">Product manuals for the systems and equipment we supply and install.</p>
          </div>
        </div>
      </section>
      <section className="section section-spacious">
        <div className="container">
          <ResourcesSubNav />
          <DocumentList documents={manuals} emptyMessage="User manuals are being added here." />
        </div>
      </section>
    </main>
  );
}
