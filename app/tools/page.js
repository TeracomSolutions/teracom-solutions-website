import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { tools } from '@/lib/tools';

export const metadata = pageMetadata({
  title: 'Free Security Installer Calculators | Teracom Solutions',
  description: 'Free CCTV storage, PoE power budget and battery standby calculators for security installers and integrators.',
  path: '/tools',
});

export default function Tools() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <Breadcrumbs
              items={[]}
              current={'Tools'}
            />
            <h1>Calculators for security installers.</h1>
            <p className="lead">Quick, free calculators for the numbers you check on every job.</p>
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          <div className="feature-grid">
            {tools.map((tool) => (
              <article key={tool.slug}>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <p><Link href={`/tools/${tool.slug}`} className="btn btn-primary">Use calculator</Link></p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}