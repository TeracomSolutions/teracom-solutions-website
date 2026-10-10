import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { brands } from '@/lib/brands';
import { findBrandAsync } from '@/lib/storeBrands';
import { productsForBrand } from '@/lib/storeBrandsMerge';
import { getAllProducts, getCustomerPricing } from '@/lib/catalogue';
import { forTiles } from '@/lib/catalogueMerge';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import BrandLogo from '@/components/BrandLogo';
import CategoryProductGrid from '@/components/CategoryProductGrid';
import CategoryIcon from '@/components/CategoryIcon';
import Breadcrumbs from '@/components/Breadcrumbs';
import { pageMetadata } from '@/lib/seo';
import { withSeoTitle } from '@/lib/seoTitles';
import BrandProfile from '@/components/BrandProfile';
import BrandArt from '@/components/BrandArt';
import { findBrandProfile } from '@/lib/brandProfiles';

const THEME_FALLBACKS = { 'cctv': '/assets/brand-fallback-cctv.svg', 'access-control': '/assets/brand-fallback-access.svg', 'audio': '/assets/brand-fallback-audio.svg', 'power': '/assets/brand-fallback-power.svg', 'networking': '/assets/brand-fallback-network.svg', 'accessories': '/assets/brand-fallback-accessories.svg' };

// A brand that arrives in a supplier's feed gets its page within five
// minutes (the slugs below are only the hand-written ones).
export const revalidate = 300;

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const brand = await findBrandAsync(params.slug);
  if (!brand) return {};
  // Search-result title only (not rendered on the page). Says what Teracom does
  // with the brand and where, which is what someone searching the brand name
  // plus "supplier"/"installer" is looking for.
  const role = brand.isOwnBrand
    ? null
    : ['access-control', 'cctv'].includes(brand.theme)
      ? 'Supplier & Installer'
      : 'Supplier';
  return withSeoTitle(
    pageMetadata({
      title: role ? `${brand.name} ${role}, Melbourne | Teracom` : `${brand.name} | Teracom Solutions, Melbourne`,
      description: brand.tagline,
      path: `/brands/${brand.slug}`,
      images: [{ url: `/brands/${brand.slug}/opengraph-image`, width: 1200, height: 630, alt: brand.name }]
    }),
    `/brands/${brand.slug}`,
  );
}

export default async function BrandPage(props) {
  const params = await props.params;
  const brand = await findBrandAsync(params.slug);
  if (!brand) notFound();

  // The brand's products in the store, priced for whoever is looking.
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  const customer = await getCustomerPricing(token);
  const storeProducts = productsForBrand(await getAllProducts(), brand);

  const paragraphs = brand.body.split('\n\n');
  // A brand with a profile gets the longer page and a drawing in the hero.
  const profile = findBrandProfile(brand.slug);

  return (
    <main id="main-content" style={{ '--brand-accent': brand.accent || '#9fb0c8' }}>
      <section className={`hero hero-product hero-shallow brand-hero${profile?.heroImage || profile?.heroArt ? ' brand-hero-with-art' : ''}`}>
        <div className="container hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[{ name: 'Brands', href: '/brands' }]} current={brand.name} />
            <div className="brand-hero-heading">
              <h1>{brand.name}</h1>
              <BrandLogo brand={brand} className="brand-hero-logo" width={180} height={48} />
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
          {profile?.heroArt && (
            <div className="brand-hero-visual">
              <BrandArt spec={profile.heroArt} uid={`${brand.slug}-hero`} accent={brand.accent} />
            </div>
          )}
          {profile?.heroImage && !profile.heroArt && (
            <div className="brand-hero-visual">
              <Image src={profile.heroImage} alt={profile.heroAlt} width={900} height={720} priority />
            </div>
          )}
        </div>
      </section>
      {profile && <BrandProfile brand={brand} profile={profile} />}
      {brand.highlights && (
        <section className="section section-spacious alt">
          <div className="container">
            <div className="section-heading left brand-highlights-heading">
              <span className="eyebrow">{brand.isOwnBrand ? `Why choose ${brand.name}` : `Why Teracom works with ${brand.name}`}</span>
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
      {storeProducts.length > 0 && (
        <section className="section section-spacious alt">
          <div className="container">
            <div className="section-heading left">
              <span className="eyebrow">Teracom Store</span>
              <h2>{brand.name} in the store.</h2>
            </div>
            <CategoryProductGrid products={forTiles(storeProducts)} isSignedIn={Boolean(token)} customer={customer} />
          </div>
        </section>
      )}
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
