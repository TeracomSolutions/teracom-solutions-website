import Image from 'next/image';
import ContactForm from '@/components/ContactForm';
import JsonLd from '@/components/JsonLd';
import { BUSINESS, SITE_ORIGIN, absoluteUrl, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact Teracom Solutions | Carrum Downs, Melbourne',
  description: 'Contact Teracom Solutions for security system design, supply, installation and support, or Teracom AI. Showroom at 1B Yazaki Way, Carrum Downs VIC. Phone +61 3 9708 2685.',
  path: '/contact',
});

export default function ContactPage({ searchParams }) {
  const leadStatus = searchParams?.lead;
  const preselectedInterest = typeof searchParams?.interest === 'string' ? searchParams.interest : '';

  return (
    <main id="main-content">
      <JsonLd schema={{
        '@type': 'ContactPage',
        name: 'Contact Teracom Solutions',
        url: absoluteUrl('/contact'),
        about: { '@id': `${SITE_ORIGIN}/#organisation` }
      }} />

      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout contact-hero">
          <div className="hero-copy">
            <span className="eyebrow">Contact</span>
            <h1>Talk to the Teracom team.</h1>
            <p className="lead">Security system design, supply, installation and support, technical consulting, the Teracom Store or Teracom AI -- tell us what you&apos;re working on.</p>
          </div>
          <div className="contact-mascot">
            <Image
              src="/assets/teracom-mascot-contact.webp"
              alt="Teracom mascot giving a thumbs up while holding a tablet"
              width={1024}
              height={1536}
              sizes="(max-width: 760px) 150px, 260px"
              priority
            />
          </div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="container contact-card">
          <div>
            {leadStatus === 'received' && (
              <p className="form-note-banner" role="status">Thanks — we&apos;ve received your enquiry and will be in touch shortly.</p>
            )}
            {leadStatus === 'error' && (
              <p className="form-error" role="alert">Something went wrong submitting your enquiry. Please try again, or email us directly.</p>
            )}

            <address className="contact-address">
              {BUSINESS.streetAddress}, {BUSINESS.addressLocality}<br />
              {BUSINESS.addressRegion} {BUSINESS.postalCode}, Australia<br />
              <a href={`tel:${BUSINESS.telephone}`}>{BUSINESS.telephoneDisplay}</a><br />
              Sales: <a href={`mailto:${BUSINESS.salesEmail}`}>{BUSINESS.salesEmail}</a><br />
              Accounts: <a href={`mailto:${BUSINESS.accountsEmail}`}>{BUSINESS.accountsEmail}</a>
            </address>

            <p>Weekdays 8am &ndash; 4:30pm, weekends closed</p>

            <div className="contact-map">
              <iframe 
                src="https://maps.google.com/maps?q=1B%20Yazaki%20Way%2C%20Carrum%20Downs%20VIC%203201%2C%20Australia&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                title="Teracom Solutions location map" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <ContactForm preselectedInterest={preselectedInterest} returnTo="/contact" />
        </div>
      </section>

      <section className="section section-spacious alt">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">What happens next</span>
            <h2>From first conversation to next steps.</h2>
          </div>

          <div className="feature-grid">
            <article>
              <h3>We reply within one business day</h3>
              <p>Your enquiry goes straight to our team, and we usually reply within one business day.</p>
            </article>
            <article>
              <h3>We talk through your requirements</h3>
              <p>We&apos;ll discuss your site, the systems you have today and what you need them to do.</p>
            </article>
            <article>
              <h3>We recommend the right next step</h3>
              <p>That might be a site visit, a design review, a quote or a Teracom AI demo -- whatever moves your project forward.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
