import Link from 'next/link';
import { ArrowRight, Columns3, Scale, ShieldCheck, Video } from 'lucide-react';

import ResourceHero from '@/components/ResourceHero';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import { getComparisons } from '@/lib/comparisons';
import { resourcesIntros } from '@/lib/resourcesIntros';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Product Comparisons: VMS and Security Systems Side by Side | Teracom',
  description: 'Independent side-by-side comparisons of video management systems and other security products, from each maker\'s own website and checked every week.',
  path: '/resources/comparisons',
});

export default async function Comparisons() {
  const comparisons = await getComparisons();

  return (
    <main id="main-content">
      <ResourceHero title="Product Comparisons" icon={Scale} badges={[Video, Columns3, ShieldCheck]}>
        <p className="lead">Competing products side by side, from each maker&apos;s own website and checked every week.</p>
      </ResourceHero>
      <section className="section section-spacious">
        <div className="container">
          <div className="copy-block">
            {resourcesIntros.comparisons.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <ResourcesSubNav />
          {comparisons.length ? (
            <div className="tools-grid">
              {comparisons.map((c) => (
                <Link href={`/resources/comparisons/${c.slug}`} className="tool-card" key={c.slug}>
                  <span className="tool-card-icon">
                    <Scale size={26} strokeWidth={1.75} aria-hidden="true" focusable="false" />
                  </span>
                  <h3>{c.title}</h3>
                  <p>{c.products.join(', ')}</p>
                  <span className="tool-card-cta">
                    Compare <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="form-note">Comparisons are being added here.</p>
          )}
        </div>
      </section>
    </main>
  );
}
