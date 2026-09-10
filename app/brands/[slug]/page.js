import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { brands, findBrand } from '@/lib/brands';

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
            <h1>{brand.name}</h1>
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
            <Image src="/assets/consulting-visual.svg" alt="Abstract technology visual" width={1200} height={700} />
          </div>
        </div>
      </section>
    </main>
  );
}
