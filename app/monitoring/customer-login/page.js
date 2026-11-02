import { notFound } from 'next/navigation';
import Link from 'next/link';
import { LogIn, MonitorSmartphone, ShieldCheck } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import OrbitArt from '@/components/OrbitArt';
import {
  MONITORING_LOGIN_PATH,
  TERACOM_AI_SIGN_IN,
  canShowMonitoringLogin,
  monitoringLoginEnabled,
  monitoringLoginFaqs,
  monitoringLoginPlanned,
  monitoringLoginToday,
} from '@/lib/monitoringLogin';
import { BUSINESS, pageMetadata } from '@/lib/seo';

// Pre-launch page for monitoring customers (see lib/monitoringLogin.js for why it is
// switched off and what the copy may and may not say).
export const dynamic = 'force-dynamic';

export function generateMetadata() {
  const metadata = pageMetadata({
    title: 'Monitoring Customer Login | Teracom Solutions',
    description:
      'Online access for Teracom monitoring customers is being planned as part of Teracom AI. Find out how to manage your monitoring today and register your interest.',
    path: MONITORING_LOGIN_PATH,
  });
  return monitoringLoginEnabled() ? metadata : { ...metadata, robots: { index: false, follow: false } };
}

export default async function MonitoringCustomerLoginPage(props) {
  const searchParams = (await props.searchParams) || {};
  if (!canShowMonitoringLogin(searchParams.preview)) notFound();

  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[{ name: 'Monitoring', href: '/monitoring' }]} current="Customer login" />
            <span className="eyebrow">Monitoring</span>
            <h1>Customer login.</h1>
            <p className="lead">
              Online access for monitoring customers is coming to Teracom AI. It is not open yet: until it is, your monitoring
              runs exactly as it does today, and we handle changes and reports for you.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/contact?interest=Monitoring">
                Register your interest
              </Link>
              <a className="btn btn-secondary" href={TERACOM_AI_SIGN_IN}>
                <LogIn size={18} strokeWidth={2} aria-hidden="true" /> Sign in to Teracom AI
              </a>
            </div>
            <p className="form-note">
              Teracom AI sign-in is for Teracom AI customers. Monitoring is not in it yet.
            </p>
          </div>
          <OrbitArt icon={MonitorSmartphone} badges={[ShieldCheck, LogIn, MonitorSmartphone]} />
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Today</span>
            <h2>Managing your monitoring now.</h2>
          </div>
          <div className="feature-grid">
            {monitoringLoginToday.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/contact?interest=Monitoring">
              Contact us
            </Link>
            <a className="btn btn-secondary" href={`mailto:${BUSINESS.salesEmail}`}>
              Email us
            </a>
          </div>
        </div>
      </section>

      <section className="section section-spacious alt">
        <div className="container two-column">
          <div className="section-sticky">
            <span className="eyebrow">Planned</span>
            <h2>What online access is meant to cover.</h2>
          </div>
          <div className="copy-block">
            <ul className="tick-list">
              {monitoringLoginPlanned.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="form-note">
              This is what we are planning, not a service you can buy yet. The list may change, and there is no date or price.
              Register your interest and we will tell you when it opens.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Questions</span>
            <h2>Before it opens.</h2>
          </div>
          <div className="faq-list">
            {monitoringLoginFaqs.map((faq) => (
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
            <h2>Not a monitoring customer yet?</h2>
            <p>See what we monitor today and how a site is set up.</p>
            <p className="form-note">
              Monitoring is provided under our <Link href="/terms">terms and conditions</Link>.
            </p>
          </div>
          <div className="cta-band-actions">
            <Link className="btn btn-primary" href="/monitoring">
              Monitoring services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
