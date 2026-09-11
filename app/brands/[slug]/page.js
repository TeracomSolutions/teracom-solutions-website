import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { brands, findBrand } from '@/lib/brands';

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
          </div>
        </div>
      </section>
      <section className="section section-spacious">
        <div className="container showcase-grid reverse">
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
          <div className="showcase-image">
            {brand.imageFile ? (
              <Image src={`/assets/brands/${brand.imageFile}`} alt={`${brand.name} product imagery`} width={1200} height={700} />
            ) : (
              <Image src={THEME_FALLBACKS[brand.theme] || '/assets/consulting-visual.svg'} alt="Abstract technology visual" width={1200} height={700} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
