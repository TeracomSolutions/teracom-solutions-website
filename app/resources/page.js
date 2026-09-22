import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Clapperboard,
  Download,
  FileSpreadsheet,
  LibraryBig,
  LifeBuoy,
  Newspaper,
} from 'lucide-react';
import { resourcesSections } from '@/lib/resourcesSections';
import { resourcesIntros } from '@/lib/resourcesIntros';
import { tools } from '@/lib/tools';

export const metadata = pageMetadata({
  title: 'Technology Resources, Manuals & Support | Teracom Solutions',
  description: 'Help centre, FAQs, user manuals, datasheets, product videos and downloads for Teracom Solutions products and services.',
  path: '/resources',
});

const SECTION_ICONS = {
  'help-centre': LifeBuoy,
  'user-manuals': BookOpen,
  datasheets: FileSpreadsheet,
  'product-videos': Clapperboard,
  downloads: Download,
  'industry-news': Newspaper,
};

export default function Resources() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">Resources</span>
            <h1>Documentation, manuals and support.</h1>
            <p className="lead">
              We know that finding the right information can be difficult and time consuming -- this page brings it
              together in one place.
            </p>
          </div>
          <div className="tool-hero-art" aria-hidden="true">
            <span className="tool-hero-ring">
              <LibraryBig size={96} strokeWidth={1.3} aria-hidden="true" focusable="false" />
            </span>
          </div>
        </div>
      </section>
      <section className="section section-spacious">
        <div className="container">
          <div className="tools-grid">
            {resourcesSections.map((s) => {
              const Icon = SECTION_ICONS[s.slug] || BookOpen;
              return (
                <Link href={`/resources/${s.slug}`} className="tool-card" key={s.slug}>
                  <span className="tool-card-icon">
                    <Icon size={26} strokeWidth={1.75} aria-hidden="true" focusable="false" />
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <span className="tool-card-cta">
                    Open <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className="tool-card-watermark" aria-hidden="true">
                    <Icon size={150} strokeWidth={1} aria-hidden="true" focusable="false" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section cta-band-section">
        <div className="container">
          <div className="cta-band">
            <div>
              <span className="eyebrow">Free tools</span>
              <h2>Tools for the industry.</h2>
              <p>{tools.length} free calculators -- cameras, storage, power, cabling, networks and AV.</p>
            </div>
            <Link className="btn btn-primary" href="/tools">
              Open the tools <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section section-spacious">
        <div className="container">
          <div className="copy-block">
            {resourcesIntros.index.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
