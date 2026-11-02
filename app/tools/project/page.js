import { FileStack, FileDown, FileUp } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import OrbitArt from '@/components/OrbitArt';
import ToolProject from '@/components/tools/ToolProject';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Project Report: Combine Calculator Results into One PDF | Teracom Solutions',
  description:
    'Add results from any of the free Teracom calculators to one project, add client, site and notes, and save it as a single PDF report. Import the PDF again later to change any result.',
  path: '/tools/project',
});

// The project report (Robert, 2026-11-02): one document built from any of the
// free calculators. The page is static; the project lives in the visitor's browser.
export default function ToolProjectPage() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[{ name: 'Tools', href: '/tools' }]} current="Project report" />
            <span className="eyebrow">Free tools</span>
            <h1>Project report.</h1>
            <p className="lead">
              Add results from any of our calculators, put in the client, site and your notes, and save the lot as one PDF.
              Keep the PDF: import it here later and every result comes back, ready to change.
            </p>
          </div>
          <OrbitArt icon={FileStack} badges={[FileDown, FileUp, FileStack]} />
        </div>
      </section>
      <section className="section">
        <ToolProject />
      </section>
    </main>
  );
}
