import Image from 'next/image';
import Link from 'next/link';
import { brands } from '@/lib/brands';

export const metadata = {
  title: 'Brands We Work With | Teracom Solutions',
  description: 'The manufacturers and product lines Teracom Solutions works with, installs and supports -- access control, CCTV, intrusion, networking, audio and power protection.',
};

export default function Brands() {
  return (
    <main>
      <section className="hero hero-product hero-shallow hero-centered">
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
                  <div className="brand-card-heading">
                    <h3>{b.name}</h3>
                    {b.logoFile && (
                      <Image
                        className="brand-card-logo"
                        src={`/assets/logos/${b.logoFile}`}
                        alt={`${b.name} logo`}
                        width={110}
                        height={30}
                      />
                    )}
                  </div>
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
