import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { resourcesSections } from '@/lib/resourcesSections';

export const metadata = pageMetadata({
  title: 'Security Resources, Manuals & Support | Teracom Solutions',
  description: 'Help centre, FAQs, user manuals, datasheets, product videos and downloads for Teracom Solutions products and services.',
  path: '/resources',
});

export default function Resources() {
  return (
    <main id="main-content">
      <section className="hero hero-product">
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">Resources</span>
            <h1>Documentation, manuals and support.</h1>
            <p className="lead">
              We know that finding the right information can be difficult and time consuming -- this page brings it
              together in one place.
            </p>
          </div>
        </div>
      </section>
      <section className="section section-spacious">
        <div className="container">
          <div className="feature-grid">
            {resourcesSections.map((s) => (
              <Link href={`/resources/${s.slug}`} key={s.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
