import { notFound } from 'next/navigation';
import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import MonitoringIcon from '@/components/MonitoringIcon';
import StoreCategoryArt from '@/components/StoreCategoryArt';
import { findMonitoringService, monitoringServices } from '@/lib/monitoring';
import { absoluteUrl, BUSINESS, pageMetadata, SITE_NAME } from '@/lib/seo';

const ART = {
  'alarm-monitoring': 'intrusion',
  'cctv-monitoring': 'cctv',
  'open-close-reporting': 'access-control',
  'patrol-response': 'facial-recognition',
  'duress-and-lone-worker': 'intrusion',
};

export function generateStaticParams() {
  return monitoringServices.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const service = findMonitoringService(params.slug);
  if (!service) return {};
  return pageMetadata({
    title: service.seoTitle,
    description: service.description,
    path: `/monitoring/${service.slug}`,
  });
}

export default async function MonitoringServicePage(props) {
  const params = await props.params;
  const service = findMonitoringService(params.slug);
  if (!service) notFound();

  const others = monitoringServices.filter((s) => s.slug !== service.slug);

  const schema = {
    '@type': 'Service',
    name: service.title,
    serviceType: service.title,
    description: service.description,
    url: absoluteUrl(`/monitoring/${service.slug}`),
    areaServed: { '@type': 'Country', name: 'Australia' },
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      legalName: BUSINESS.legalName,
      telephone: BUSINESS.telephone,
      url: absoluteUrl('/'),
    },
  };

  return (
    <main id="main-content">
      <JsonLd schema={schema} />

      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[{ name: 'Monitoring', href: '/monitoring' }]} current={service.title} />
            <span className="eyebrow">Monitoring</span>
            <h1>{service.title}</h1>
            <p className="lead">{service.lead}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/contact?interest=Monitoring">
                Ask about {service.title.toLowerCase()}
              </Link>
              <Link className="btn btn-secondary" href="/monitoring">
                All monitoring services
              </Link>
            </div>
          </div>
          <StoreCategoryArt slug={ART[service.slug] || 'intrusion'} />
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container two-column">
          <div className="section-sticky">
            <span className="tool-card-icon">
              <MonitoringIcon name={service.icon} />
            </span>
            <h2>What it is.</h2>
          </div>
          <div className="copy-block">
            {service.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-spacious alt">
        <div className="container product-detail-grid">
          <div>
            <h2>What&apos;s included</h2>
            <ul className="tick-list">
              {service.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Worth knowing</h2>
            <ul className="tick-list">
              {service.considerations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Also available</span>
            <h2>The rest of what we monitor.</h2>
          </div>
          <div className="feature-grid">
            {others.map((other) => (
              <Link href={`/monitoring/${other.slug}`} key={other.slug}>
                <article>
                  <div className="category-heading-row">
                    <div className="category-icon-badge">
                      <MonitoringIcon name={other.icon} />
                    </div>
                    <h3>{other.title}</h3>
                  </div>
                  <p>{other.summary}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-band-section">
        <div className="container cta-band">
          <div>
            <h2>Not sure which of these you need?</h2>
            <p>
              Tell us about the site and we will tell you honestly what is worth monitoring and what is not.
            </p>
            <p className="form-note">
              Monitoring is provided under our <Link href="/terms">terms and conditions</Link>.
            </p>
          </div>
          <div className="cta-band-actions">
            <Link className="btn btn-primary" href="/contact?interest=Monitoring">
              Get in touch
            </Link>
            <a className="btn btn-secondary" href={`tel:${BUSINESS.telephone}`}>
              Call {BUSINESS.telephoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
