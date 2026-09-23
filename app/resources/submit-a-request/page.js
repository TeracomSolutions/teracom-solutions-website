import Link from 'next/link';
import { ArrowLeft, ClipboardList, FileSignature, KeyRound, Mail, Wrench } from 'lucide-react';

import ResourceHero from '@/components/ResourceHero';
import { pageMetadata, BUSINESS } from '@/lib/seo';
import { requestForms } from '@/lib/requestForms';

export const metadata = pageMetadata({
  title: 'Submit a Request | Teracom Solutions',
  description:
    'Book a service call, request a recorder password reset, or apply for a trade account with Teracom Solutions.',
  path: '/resources/submit-a-request',
});

const ICONS = { wrench: Wrench, key: KeyRound };

export default function SubmitARequestPage() {
  return (
    <main id="main-content">
      <ResourceHero title="Submit a request" icon={ClipboardList} badges={[Wrench, KeyRound, FileSignature]}>
        <p className="lead">
          Book a job, get a recorder unlocked, or open an account. These go straight to the team who does the work.
        </p>
      </ResourceHero>

      <section className="section section-spacious">
        <div className="container">
          <div className="copy-block">
            <p>
              Every request here reaches the same people who would answer the phone, and tells them what they need to
              know before they ring you back &mdash; which usually saves a call and sometimes saves a visit.
            </p>
            <p>
              Filling one in takes a couple of minutes and gets the details down in one go, rather than being
              repeated over the phone. We will come back to you to confirm.
            </p>
          </div>

          <div className="feature-grid request-grid">
            {requestForms.map((form) => {
              const Icon = ICONS[form.icon] || ClipboardList;
              return (
                <Link href={`/resources/submit-a-request/${form.slug}`} key={form.slug}>
                  <article>
                    <div className="category-heading-row">
                      <div className="category-icon-badge">
                        <Icon size={26} strokeWidth={1.75} aria-hidden="true" focusable="false" />
                      </div>
                      <h3>{form.title}</h3>
                    </div>
                    <p>{form.lead}</p>
                  </article>
                </Link>
              );
            })}

            {/* Deliberately a phone call for now: a trade account application
                includes a personal guarantee, and that is not something to
                collect through a form nobody has had a solicitor read. */}
            <article>
              <div className="category-heading-row">
                <div className="category-icon-badge">
                  <FileSignature size={26} strokeWidth={1.75} aria-hidden="true" focusable="false" />
                </div>
                <h3>Trade account application</h3>
              </div>
              <p>
                30-day credit or trade cash accounts. Email{' '}
                <a href={`mailto:${BUSINESS.salesEmail}`}>{BUSINESS.salesEmail}</a> and we will send you the
                application &mdash; online applications are coming.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <p className="form-note request-back">
            <ArrowLeft size={16} strokeWidth={1.9} aria-hidden="true" focusable="false" />{' '}
            <Link href="/resources">Back to all resources</Link>
          </p>
        </div>
      </section>

      <section className="section cta-band-section">
        <div className="container cta-band">
          <div>
            <h2>Not sure which one you need?</h2>
            <p>Tell us what is happening and we will point you at the right thing, or just deal with it.</p>
          </div>
          <div className="cta-band-actions">
            <Link className="btn btn-primary" href="/contact">
              Get in touch
            </Link>
            <a className="btn btn-secondary" href={`mailto:${BUSINESS.supportEmail}`}>
              <Mail size={18} strokeWidth={1.9} aria-hidden="true" focusable="false" />
              Email support
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
