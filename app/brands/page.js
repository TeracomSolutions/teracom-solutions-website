import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { getBrands } from '@/lib/storeBrands';

// A brand that arrives in a supplier's feed shows here within five minutes.
export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Technology & Security Brands We Supply | Teracom Solutions',
  description: 'The manufacturers and product lines Teracom Solutions works with, installs and supports -- access control, CCTV, intrusion, networking, audio and power protection.',
  path: '/brands',
});

export default async function Brands() {
  const all = await getBrands();
  const brands = all.filter((b) => !b.isStoreBrand || b.supported);
  const storeBrands = all.filter((b) => b.isStoreBrand && !b.supported && b.products > 0);
  return (
    <main id="main-content">
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
          <div className="feature-grid brands-grid">
            {brands.map((b) => (
              <Link href={`/brands/${b.slug}`} key={b.slug} style={b.accent ? { '--card-accent': b.accent } : undefined}>
                <article>
                  <div className="brand-card-heading">
                    <h3>{b.name}</h3>
                    <BrandLogo brand={b} className="brand-card-logo" width={110} height={30} />
                  </div>
                  <p>{b.tagline}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {storeBrands.length > 0 && (
        <section className="section section-spacious alt">
          <div className="container">
            <div className="section-heading left">
              <span className="eyebrow">Teracom Store</span>
              <h2>More brands in the store.</h2>
            </div>
            <div className="feature-grid brands-grid">
              {storeBrands.map((b) => (
                <Link href={`/brands/${b.slug}`} key={b.slug}>
                  <article>
                    <div className="brand-card-heading">
                      <h3>{b.name}</h3>
                      <BrandLogo brand={b} className="brand-card-logo" width={110} height={30} />
                    </div>
                    <p>{b.products} {b.products === 1 ? 'product' : 'products'} in the Teracom Store.</p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
