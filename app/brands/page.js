import Link from 'next/link';
import { brands } from '@/lib/brands';

export const metadata = {
  title: 'Brands We Work With | Teracom Solutions',
  description: 'The manufacturers and product lines Teracom Solutions works with, installs and supports -- access control, CCTV, intrusion, networking, audio and power protection.',
};

export default function Brands() {
  return (
    <main>
      <section className="hero hero-product">
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">Brands</span>
            <h1>Brands we work with.</h1>
            <p className="lead">
              We work across a wide range of access control, CCTV, intrusion, networking, audio and power protection
              manufacturers -- here&apos;s a look at the brands behind the systems we design, supply and support.
            </p>
          </div>
        </div>
      </section>
      <section className="section section-spacious">
        <div className="container">
          <div className="feature-grid">
            {brands.map((b) => (
              <Link href={`/brands/${b.slug}`} key={b.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article>
                  <h3>{b.name}</h3>
                  <p>{b.tagline}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
