import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { brands, findBrand } from '@/lib/brands';
import CategoryIcon from '@/components/CategoryIcon';

const THEME_FALLBACKS = { 'cctv': '/assets/brand-fallback-cctv.svg', 'access-control': '/assets/brand-fallback-access.svg', 'audio': '/assets/brand-fallback-audio.svg', 'power': '/assets/brand-fallback-power.svg', 'networking': '/assets/brand-fallback-network.svg', 'accessories': '/assets/brand-fallback-accessories.svg' };

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export function generateMetadata({ params }) {
  const brand = findBrand(params.slug);
  if (!brand) return {};
  return {
    title: `${brand.name} | Teracom Solutions`,
    description: brand.tagline,
  };
}

export default function BrandPage({ params }) {
  const brand = findBrand(params.slug);
  if (!brand) notFound();

  const paragraphs = brand.body.split('\n\n');

  return (
    <main>
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">
              <Link href="/brands" style={{ color: 'inherit' }}>
                &larr; Brands
              </Link>
            </span>
            <div className="brand-hero-heading">
              <h1>{brand.name}</h1>
              {brand.logoFile && (
                <Image
                  className="brand-hero-logo"
                  src={`/assets/logos/${brand.logoFile}`}
                  alt={`${brand.name} logo`}
                  width={180}
                  height={48}
                />
              )}
            </div>
            <p className="lead">{brand.tagline}</p>
            {brand.stats && (
              <div className="brand-stats">
                {brand.stats.map((s) => (
                  <div className="brand-stat" key={s.label}>
                    {s.icon && (
                      <span className="brand-stat-icon">
                        <CategoryIcon slug={s.icon} />
                      </span>
                    )}
                    <span className="brand-stat-value">{s.value}</span>
                    <span className="brand-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      {brand.highlights && (
        <section className="section section-spacious alt">
          <div className="container">
            <div className="section-heading left brand-highlights-heading">
              <span className="eyebrow">Why Teracom works with {brand.name}</span>
              <h2>{brand.highlightsHeading}</h2>
            </div>
            <div className="feature-grid brand-highlight-grid">
              {brand.highlights.map((h) => (
                <article key={h.title}>
                  {h.icon && (
                    <span className="category-icon-badge" style={{ marginBottom: '16px' }}>
                      <CategoryIcon slug={h.icon} />
                    </span>
                  )}
                  <h3>{h.title}</h3>
                  <p>{h.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="section section-spacious">
        <div className="container showcase-grid reverse brand-showcase-grid">
          <div className="showcase-copy">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {brand.needsInput && (
              <p className="form-note">
                Want to know more about why we chose to work with {brand.name}?{' '}
                <Link href="/#contact" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  Contact us
                </Link>
                .
              </p>
            )}
          </div>
          <div className="showcase-image brand-showcase-image">
            {brand.imageFile ? (
              <Image src={`/assets/brands/${brand.imageFile}`} alt={`${brand.name} product imagery`} fill style={{ objectFit: 'cover' }} sizes="(max-width: 980px) 100vw, 45vw" />
            ) : (
              <Image src={THEME_FALLBACKS[brand.theme] || '/assets/consulting-visual.svg'} alt="Abstract technology visual" fill style={{ objectFit: 'cover' }} sizes="(max-width: 980px) 100vw, 45vw" />
            )}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="brand-store-cta">
            <div>
              <h3>Interested in {brand.name} products?</h3>
              <p>Visit the Teracom Store for current stock, pricing and availability.</p>
            </div>
            <Link className="btn btn-primary" href="/store">
              Visit the Store
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
