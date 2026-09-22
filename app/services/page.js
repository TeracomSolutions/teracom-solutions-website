import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProcessSteps from '@/components/ProcessSteps';
import ServiceCard from '@/components/ServiceCard';
import { serviceGroups, services } from '@/lib/services';
import { brands } from '@/lib/brands';
import { tools } from '@/lib/tools';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Technology Services, End to End | Teracom Solutions',
  description:
    'Access control, CCTV, alarms, intercoms, electrical, automation, AV, networking, software development and systems integration -- designed, supplied, installed and supported by one team.',
  path: '/services',
});

const logoBrands = brands.filter((brand) => brand.logoFile);

const STATS = [
  { value: services.length, label: 'technology services' },
  { value: brands.length, label: 'brands we work with' },
  { value: tools.length, label: 'free industry tools' },
  { value: 1, label: 'team, from design to support' },
];

export default function Services() {
  return (
    <main id="main-content">
      <section className="hero hero-product services-hero">
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">What we do</span>
            <h1>Technology services, end to end.</h1>
            <p className="lead">
              From consultancy and design through software, supply, installation and ongoing support -- one team
              across your whole technology stack, not a different contractor at every stage.
            </p>
            <nav className="service-jump" aria-label="Service groups">
              {serviceGroups.map((group) => (
                <a href={`#${group.id}`} key={group.id}>{group.eyebrow}</a>
              ))}
            </nav>
          </div>
          <div className="hero-image">
            <Image
              src="/assets/teracom-on-site.webp"
              alt="Tera, the Teracom mascot, on site with plans -- plan, install, support, evolve"
              width={1536}
              height={1024}
              sizes="(max-width: 980px) 100vw, 55vw"
              priority
            />
          </div>
        </div>
        <div className="container">
          <dl className="service-stats">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {serviceGroups.map((group, gi) => {
        const groupServices = services.filter((s) => s.group === group.id);
        return (
          <section className={`section section-spacious service-group${gi % 2 === 0 ? ' alt' : ''}`} id={group.id} key={group.id}>
            <div className="container">
              <div className="section-heading left tools-group-heading">
                <span className="eyebrow">{group.eyebrow}</span>
                <h2>{group.title}</h2>
                <p>{group.text}</p>
              </div>
              <div className="tools-grid service-grid" data-count={groupServices.length}>
                {groupServices.map((service) => (
                  <ServiceCard service={service} number={services.indexOf(service) + 1} key={service.slug} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="section product-showcase">
        <div className="container showcase-grid">
          <div className="showcase-image">
            <Image
              src="/assets/teracom-ai-ask-tera.webp"
              alt="Tera, the Teracom AI mascot, at a laptop with the Ask Tera assistant"
              width={1536}
              height={1024}
              sizes="(max-width: 980px) 100vw, 55vw"
            />
          </div>
          <div className="showcase-copy">
            <span className="eyebrow">Built in-house</span>
            <h2>Software and integration, built in-house.</h2>
            <p>
              The team that builds Teracom AI also builds the tools and integrations your systems are missing -- custom
              applications, workflow automation, and connections between access, video, alarms and business systems.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/services/software-development">Software development</Link>
              <Link className="btn btn-secondary" href="/services/integration-development">Systems integration</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-spacious alt">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">How we deliver</span>
            <h2>From consultancy to completion.</h2>
            <p>One team across the whole journey.</p>
          </div>
          <ProcessSteps />
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Brands</span>
            <h2>Technology we work with.</h2>
            <p>Manufacturers we supply, install and support.</p>
          </div>
          <div className="logo-wall">
            {logoBrands.map((brand) => (
              <Link href={`/brands/${brand.slug}`} className="logo-chip" key={brand.slug}>
                <div className="logo-tile-image">
                  <Image src={`/assets/logos/${brand.logoFile}`} alt={`${brand.name} logo`} fill style={{ objectFit: 'contain' }} sizes="140px" className="logo-mono" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-band-section">
        <div className="container">
          <div className="cta-band">
            <div>
              <span className="eyebrow">Start a project</span>
              <h2>Tell us what you&apos;re working on.</h2>
              <p>We usually reply within one business day.</p>
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
