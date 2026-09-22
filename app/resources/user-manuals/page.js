import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import { resourcesIntros } from '@/lib/resourcesIntros';
import Breadcrumbs from '@/components/Breadcrumbs';
import DocumentList from '@/components/DocumentList';
import { manuals } from '@/lib/resourceDocuments';

export const metadata = pageMetadata({
  title: 'Security System User Manuals | Teracom Solutions',
  description: 'Product manuals for the systems and equipment Teracom Solutions supplies and installs.',
  path: '/resources/user-manuals',
});

export default function UserManuals() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <Breadcrumbs
              items={[{ name: 'Resources', href: '/resources' }]}
              current={'User Manuals'}
            />
            <h1>User Manuals</h1>
            <p className="lead">Product manuals for the systems and equipment we supply and install.</p>
          </div>
        </div>
      </section>
      <section className="section section-spacious">
        <div className="container">
          <div className="copy-block">
            {resourcesIntros['user-manuals'].map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <ResourcesSubNav />
          <DocumentList documents={manuals} emptyMessage="User manuals are being added here." />
        </div>
      </section>
    </main>
  );
}
