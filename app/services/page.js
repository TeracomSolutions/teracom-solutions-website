import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { services } from '@/lib/services';

export const metadata = pageMetadata({
  title: 'Security Installation & Consulting Services | Teracom',
  description: 'Access control, CCTV, intrusion alarms, intercoms, AV, electrical, automation and networking -- designed, supplied, installed and supported by Teracom Solutions.',
  path: '/services'
});

export default function Services() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow hero-centered">
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">Services</span>
            <h1>Security and technology services, end to end.</h1>
            <p className="lead">Teracom provides comprehensive security solutions from consultancy through to installation and ongoing support.</p>
          </div>
        </div>
      </section>
      <section className="section section-spacious">
        <div className="container">
          <div className="feature-grid">
            {services.map((service) => (
              <Link href={`/services/${service.slug}`} key={service.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article>
                  <h3>{service.title}</h3>
                  <p>{service.lead}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}