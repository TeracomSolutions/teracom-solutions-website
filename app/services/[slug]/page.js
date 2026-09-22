import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import ProcessSteps from '@/components/ProcessSteps';
import ServiceCard from '@/components/ServiceCard';
import ServiceIcon from '@/components/ServiceIcon';
import { findService, serviceGroups, services } from '@/lib/services';
import { findBrand } from '@/lib/brands';
import { findCategory } from '@/lib/categories';
import { SITE_ORIGIN, absoluteUrl, pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const service = findService(params.slug);
  if (!service) return {};

  return pageMetadata({
    title: service.seoTitle,
    description: service.description,
    path: `/services/${params.slug}`
  });
}

export default async function ServicePage(props) {
  const params = await props.params;
  const service = findService(params.slug);
  if (!service) notFound();

  const group = serviceGroups.find((g) => g.id === service.group);
  const category = service.storeCategory ? findCategory(service.storeCategory) : null;
  const serviceBrands = service.brandSlugs
    .map((slug) => findBrand(slug))
    .filter((brand) => brand && brand.logoFile);
  const related = services.filter((s) => s.group === service.group && s.slug !== service.slug);

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
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[{ name: 'Services', href: '/services' }]} current={service.title} />
            {group ? <span className="eyebrow">{group.eyebrow}</span> : null}
            <h1>{service.title}</h1>
            <p className="lead">{service.lead}</p>
            {service.tags?.length ? (
              <p className="service-tags service-tags-hero">
                {service.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </p>
            ) : null}
          </div>
          <div className="tool-hero-art" aria-hidden="true">
            <span className="tool-hero-ring">
              <ServiceIcon slug={service.slug} size={96} strokeWidth={1.3} />
            </span>
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container service-intro">
          <div className="copy-block">
            {service.intro.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/contact">Talk to us</Link>
              {category ? (
                <Link className="btn btn-secondary" href={`/store/${category.slug}`}>Shop {category.title}</Link>
              ) : null}
            </div>
          </div>
          {service.image ? (
            <div className="showcase-image service-image hero-blend">
              <Image src={service.image} alt="" width={1536} height={1024} sizes="(max-width: 980px) 100vw, 45vw" />
            </div>
          ) : (
            <div className="service-art" aria-hidden="true">
              <ServiceIcon slug={service.slug} size={150} strokeWidth={1} />
            </div>
          )}
        </div>
      </section>

      <section className="tool-stage">
        <div className="tool-backdrop" aria-hidden="true">
          <span className="tool-backdrop-main">
            <ServiceIcon slug={service.slug} size={520} strokeWidth={0.6} />
          </span>
        </div>
        <div className="tool-stage-inner section section-spacious">
          <div className="container">
            <div className="section-heading left tools-group-heading">
              <span className="eyebrow">What&apos;s included</span>
              <h2>Everything from first plan to ongoing support.</h2>
            </div>
            <ul className="include-grid">
              {service.includes.map((item) => (
                <li key={item}>
                  <span className="include-check">
                    <Check size={18} strokeWidth={2.4} aria-hidden="true" focusable="false" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">How we deliver</span>
            <h2>One team across the whole journey.</h2>
            <p>Not a different contractor at every stage.</p>
          </div>
          <ProcessSteps />
        </div>
      </section>

      {serviceBrands.length > 0 && (
        <section className="section section-spacious alt">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Brands</span>
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

      {related.length > 0 && (
        <section className="section section-spacious">
          <div className="container">
            <div className="section-heading left tools-group-heading">
              <span className="eyebrow">{group ? group.eyebrow : 'Related services'}</span>
              <h2>Often delivered together.</h2>
            </div>
            <div className="tools-grid service-grid" data-count={related.length}>
              {related.map((s) => (
                <ServiceCard service={s} key={s.slug} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section cta-band-section">
        <div className="container">
          <div className="cta-band">
            <div>
              <span className="eyebrow">{service.title}</span>
              <h2>Talk to us about your project.</h2>
              <p>Tell us about your site and what you need -- we usually reply within one business day.</p>
            </div>
            <Link className="btn btn-primary" href="/contact">
              Contact us <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
