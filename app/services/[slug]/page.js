import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { findService, services } from '@/lib/services';
import { findBrand } from '@/lib/brands';
import { findCategory } from '@/lib/categories';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { SITE_ORIGIN, absoluteUrl, pageMetadata } from '@/lib/seo';

// Same five steps as the homepage's "How we deliver" section (app/page.js).
const HOW_WE_DELIVER = [
  { title: 'Consultancy & Design', text: 'Independent advice on system selection, architecture and technical design before a single product is ordered.' },
  { title: 'Software Development', text: 'The Teracom AI platform and custom software tools, built in-house by our own development team.' },
  { title: 'Hardware Supply', text: 'Access control, CCTV, intrusion, networking and audio hardware from the manufacturers we work with directly.' },
  { title: 'Installation & Service', text: 'Licensed technicians and electricians handling installation, commissioning and ongoing maintenance on-site.' },
  { title: 'Ongoing Support', text: 'Monitoring, technical support and account management for the life of the system, not just the install.' },
];

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }) {
  const service = findService(params.slug);
  if (!service) return {};

  return pageMetadata({
    title: service.seoTitle,
    description: service.description,
    path: `/services/${params.slug}`
  });
}

export default function ServicePage({ params }) {
  const service = findService(params.slug);
  if (!service) notFound();

  const category = service.storeCategory ? findCategory(service.storeCategory) : null;

  // Get brand objects for the service brands, filtering out those without logoFile or not in lib/brands.js
  const serviceBrands = service.brandSlugs
    .map(slug => findBrand(slug))
    .filter(brand => brand && brand.logoFile);

  const SERVICE_SCHEMA = {
    '@type': 'Service',
    name: service.title,
    description: service.description,
    serviceType: service.title,
    provider: { '@id': `${SITE_ORIGIN}/#organisation` },
    areaServed: [
      { '@type': 'State', name: 'Victoria' },
      { '@type': 'State', name: 'New South Wales' }
    ],
    url: absoluteUrl(`/services/${service.slug}`)
  };

  return (
    <main id="main-content">
      <JsonLd schema={SERVICE_SCHEMA} />
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[{ name: 'Services', href: '/services' }]} current={service.title} />
            <h1>{service.title}</h1>
            <p className="lead">{service.lead}</p>
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          <div className="copy-block">
            {service.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-spacious alt">
        <div className="container">
          <div className="section-heading">
            <h2>What&apos;s included</h2>
          </div>
          <ul className="tick-list">
            {service.includes.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          <div className="section-heading">
            <h2>How we deliver</h2>
            <p>One team across the whole journey -- not a different contractor at every stage.</p>
          </div>
          <div className="feature-grid">
            {HOW_WE_DELIVER.map((item, i) => (
              <article key={item.title}>
                <span style={{ color: 'var(--red)', fontWeight: 900, fontSize: '14px', letterSpacing: '.08em' }}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {serviceBrands.length > 0 && (
        <section className="section section-spacious alt">
          <div className="container">
            <div className="section-heading">
              <h2>Brands we work with</h2>
              <p>Manufacturers we supply and work with directly.</p>
            </div>
            <div className="logo-wall">
              {serviceBrands.map((brand) => (
                <Link href={`/brands/${brand.slug}`} className="logo-chip" key={brand.slug}>
                  <div className="logo-tile-image">
                    <Image src={`/assets/logos/${brand.logoFile}`} alt={`${brand.name} logo`} fill style={{ objectFit: 'contain' }} sizes="140px" className="logo-mono" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {category && (
        <section className="section section-spacious">
          <div className="container">
            <div className="section-heading">
              <h2>Products</h2>
              <p>Browse our selection of {service.title} in the Teracom Store.</p>
            </div>
            <p><Link className="btn btn-primary" href={`/store/${category.slug}`}>Browse {service.title} products in the Teracom Store</Link></p>
          </div>
        </section>
      )}

      <section className="section section-spacious alt">
        <div className="container">
          <div className="section-heading">
            <h2>Talk to us about your project.</h2>
            <p>Tell us about your site and what you need -- we usually reply within one business day.</p>
          </div>
          <p><Link className="btn btn-primary" href="/contact">Contact us</Link></p>
        </div>
      </section>
    </main>
  );
}