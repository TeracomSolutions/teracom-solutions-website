import Link from 'next/link';
import { Cable, ClipboardList, Radio, Search, Wrench } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import MonitoringIcon from '@/components/MonitoringIcon';
import ProcessSteps from '@/components/ProcessSteps';
import StoreCategoryArt from '@/components/StoreCategoryArt';
import {
  connectionPaths,
  monitoringFaqs,
  monitoringServices,
  monitoringSteps,
} from '@/lib/monitoring';
import { absoluteUrl, BUSINESS, pageMetadata, SITE_NAME } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Alarm & CCTV Monitoring Services Australia | Teracom Solutions',
  description:
    'Back-to-base alarm monitoring, CCTV and video monitoring, open/close reporting, patrol response and duress monitoring for commercial sites across Australia.',
  path: '/monitoring',
});

const STEP_ICONS = [Search, ClipboardList, Cable, Wrench, Radio];

const BENEFITS = [
  {
    title: 'Monitored 24 hours a day',
    text: 'Signals arrive at our control room within seconds, every hour of every day, including the hours when nobody is at your site.',
  },
  {
    title: 'A response written for your site',
    text: 'Who is called, in what order, what happens after hours and when a patrol attends -- decided with you when the site is set up, not assumed.',
  },
  {
    title: 'A supervised connection',
    text: 'On a polled path, the control room notices when the connection fails. An unmonitored path only tells you it is broken when an alarm does not arrive.',
  },
  {
    title: 'The same team that installed it',
    text: 'We supply, install, commission and monitor. When something needs looking at, there is one number to call and no argument about whose problem it is.',
  },
];

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: monitoringFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

const SERVICE_SCHEMA = {
  '@type': 'Service',
  name: 'Alarm and CCTV monitoring',
  serviceType: 'Security alarm monitoring',
  description:
    'Back-to-base alarm monitoring, CCTV and video monitoring, open and close reporting, patrol response and duress monitoring for commercial and residential sites.',
  url: absoluteUrl('/monitoring'),
  areaServed: { '@type': 'Country', name: 'Australia' },
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: BUSINESS.legalName,
    ...(BUSINESS.telephone ? { telephone: BUSINESS.telephone } : {}),
    url: absoluteUrl('/'),
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Monitoring services',
    itemListElement: monitoringServices.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.title,
        description: service.description,
        url: absoluteUrl(`/monitoring/${service.slug}`),
      },
    })),
  },
};

export default function MonitoringPage() {
  return (
    <main id="main-content">
      <JsonLd schema={SERVICE_SCHEMA} />
      <JsonLd schema={FAQ_SCHEMA} />

      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[]} current="Monitoring" />
            <span className="eyebrow">Monitoring</span>
            <h1>Someone is watching, 24 hours a day.</h1>
            <p className="lead">
              An alarm that only sounds a siren relies on a passer-by caring enough to act. Back-to-base monitoring puts
              a staffed control room behind your system instead &mdash; and a response procedure written for your site.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/contact?interest=Monitoring">
                Ask about monitoring
              </Link>
              <Link className="btn btn-secondary" href="#how-it-works">
                How it works
              </Link>
            </div>
          </div>
          <StoreCategoryArt slug="intrusion" />
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container two-column">
          <div className="section-sticky">
            <span className="eyebrow">Overview</span>
            <h2>Monitoring is the part that happens when nobody is there.</h2>
          </div>
          <div className="copy-block">
            <p>
              Teracom monitors alarm systems and cameras for commercial and residential sites across Australia. Signals
              from your panel arrive at our control room, where an operator works through the response procedure agreed
              for your site: calling your nominated contacts in the order you set, sending a patrol, or escalating to
              emergency services.
            </p>
            <p>
              We already monitor sites for customers who came to us for the installation, and the two are deliberately
              joined up. The people who specified and commissioned your system are the people whose control room it
              reports to, which removes the most tedious conversation in this industry &mdash; the one where the
              installer blames the monitoring company and the monitoring company blames the installer.
            </p>
            <p>
              Monitoring suits any site where the gap between something happening and someone finding out is the real
              risk: premises that sit empty overnight, yards and compounds, sites with staff working alone or closing
              up by themselves, and anywhere an insurer or a head contract asks for it.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-spacious alt">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Services</span>
            <h2>What we monitor.</h2>
            <p>Each of these can stand on its own, and most sites run two or three of them together.</p>
          </div>
          <div className="feature-grid">
            {monitoringServices.map((service) => (
              <Link href={`/monitoring/${service.slug}`} key={service.slug}>
                <article>
                  <div className="category-heading-row">
                    <div className="category-icon-badge">
                      <MonitoringIcon name={service.icon} />
                    </div>
                    <h3>{service.title}</h3>
                  </div>
                  <p>{service.summary}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Why monitor with us</span>
            <h2>What you actually get.</h2>
          </div>
          <div className="feature-grid">
            {BENEFITS.map((benefit) => (
              <article key={benefit.title}>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-spacious alt">
        <div className="container two-column">
          <div className="section-sticky">
            <span className="eyebrow">Connection</span>
            <h2>How your panel reaches the control room.</h2>
            <p>
              This is the decision that quietly determines how good your monitoring is. We will recommend a path that
              suits the site rather than the most expensive one.
            </p>
          </div>
          <dl className="monitoring-paths">
            {connectionPaths.map((path) => (
              <div key={path.name}>
                <dt>{path.name}</dt>
                <dd>{path.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section-spacious" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">How it works</span>
            <h2>From first look to live monitoring.</h2>
            <p>Nothing goes live untested. Every documented zone is proved on site before the system is handed over.</p>
          </div>
          <ProcessSteps steps={monitoringSteps.map((step, i) => ({ ...step, icon: STEP_ICONS[i] }))} />
        </div>
      </section>

      <section className="section section-spacious alt">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Questions</span>
            <h2>Monitoring, answered plainly.</h2>
          </div>
          <div className="faq-list">
            {monitoringFaqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-band-section">
        <div className="container cta-band">
          <div>
            <h2>Talk to us about monitoring your site.</h2>
            <p>
              Tell us what panel you have and how the site is used, and we will come back with a recommendation and a
              price. Online applications are coming; for now it is a conversation.
            </p>
            {/* Monitoring is a service contract, not a product. The page
                describes the service; the agreement is what governs it. */}
            <p className="form-note">
              Monitoring is provided under our <Link href="/terms">terms and conditions</Link>.
            </p>
          </div>
          <div className="cta-band-actions">
            <Link className="btn btn-primary" href="/contact?interest=Monitoring">
              Ask about monitoring
            </Link>
            <a className="btn btn-secondary" href={`mailto:${BUSINESS.salesEmail}`}>
              Call {BUSINESS.telephoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
