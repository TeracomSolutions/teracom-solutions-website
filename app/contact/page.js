import Image from 'next/image';
import LeadSubmitted from '@/components/LeadSubmitted';
import ContactForm from '@/components/ContactForm';
import ProcessSteps from '@/components/ProcessSteps';
import { MailCheck, MessagesSquare, Signpost, Star } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { BUSINESS, SITE_ORIGIN, absoluteUrl, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact Teracom Solutions | Carrum Downs, Melbourne',
  description: 'Contact Teracom Solutions for technology design, supply, installation and support, software and integration, or Teracom AI. Showroom at 1B Yazaki Way, Carrum Downs VIC. Email sales@teracomsolutions.com.au.',
  path: '/contact',
});

const NEXT_STEPS = [
  { icon: MailCheck, title: 'We reply within one business day', text: 'Your enquiry goes straight to our team, and we usually reply within one business day.' },
  { icon: MessagesSquare, title: 'We talk through your requirements', text: "We'll discuss your site, the systems you have today and what you need them to do." },
  { icon: Signpost, title: 'We recommend the right next step', text: 'That might be a site visit, a design review, a quote or a Teracom AI demo -- whatever moves your project forward.' },
];

export default async function ContactPage(props) {
  const searchParams = await props.searchParams;
  const leadStatus = searchParams?.lead;
  const preselectedInterest = typeof searchParams?.interest === 'string' ? searchParams.interest : '';

  return (
    <main id="main-content"><LeadSubmitted source="contact_form" />
      <JsonLd schema={{
        '@type': 'ContactPage',
        name: 'Contact Teracom Solutions',
        url: absoluteUrl('/contact'),
        about: { '@id': `${SITE_ORIGIN}/#organisation` }
      }} />

      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout mascot-hero">
          <div className="hero-copy">
            <span className="eyebrow">Contact</span>
            <h1>Talk to the Teracom team.</h1>
            <p className="lead">Technology design, supply, installation and support, software and integration, technical consulting, the Teracom Store or Teracom AI -- tell us what you&apos;re working on.</p>
          </div>
          <div className="hero-mascot">
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
        <div className="container contact-card contact-card-stretch">
          <div>
            {leadStatus === 'received' && (
              <p className="form-note-banner" role="status">Thanks — we&apos;ve received your enquiry and will be in touch shortly.</p>
            )}
            {leadStatus === 'error' && (
              <p className="form-error" role="alert">Something went wrong submitting your enquiry. Please try again, or email us directly.</p>
            )}

            <Image
              className="contact-logo"
              src="/assets/teracom-logo.png"
              alt="Teracom Solutions"
              width={260}
              height={101}
            />
            <address className="contact-address">
              {BUSINESS.streetAddress}, {BUSINESS.addressLocality}<br />
              {BUSINESS.addressRegion} {BUSINESS.postalCode}, Australia<br />
              Sales: <a href={`mailto:${BUSINESS.salesEmail}`}>{BUSINESS.salesEmail}</a>
            </address>

            <p>Weekdays 9am &ndash; 4:30pm, weekends closed</p>
            <p>
              <a className="google-reviews-link" href={BUSINESS.googleBusinessUrl} target="_blank" rel="noopener noreferrer">
                <Star size={16} strokeWidth={2} fill="currentColor" aria-hidden="true" /> Read our reviews on Google
              </a>
            </p>

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

          <ProcessSteps steps={NEXT_STEPS} />
        </div>
      </section>
    </main>
  );
}
