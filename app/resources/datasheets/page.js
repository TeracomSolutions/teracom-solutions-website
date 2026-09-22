import { Cpu, FileSpreadsheet, FileText, Ruler } from 'lucide-react';
import ResourceHero from '@/components/ResourceHero';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import { resourcesIntros } from '@/lib/resourcesIntros';
import DocumentList from '@/components/DocumentList';
import { datasheets } from '@/lib/resourceDocuments';

export const metadata = pageMetadata({
  title: 'Security Product Datasheets | Teracom Solutions',
  description: 'Technical specification sheets for the Teracom Solutions product range.',
  path: '/resources/datasheets',
});

export default function Datasheets() {
  return (
    <main id="main-content">
      <ResourceHero title="Datasheets" icon={FileSpreadsheet} badges={[Cpu, Ruler, FileText]}>
        <p className="lead">Technical specification sheets for our product range.</p>
      </ResourceHero>
      <section className="section section-spacious">
        <div className="container">
          <div className="copy-block">
            {resourcesIntros['datasheets'].map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <ResourcesSubNav />
          <DocumentList documents={datasheets} emptyMessage="Datasheets are being added here." />
        </div>
      </section>
    </main>
  );
}
