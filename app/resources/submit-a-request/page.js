import Link from 'next/link';
import { ArrowLeft, ArrowRight, ClipboardList, KeyRound, Mail, Wallet, Wrench } from 'lucide-react';

import ResourceHero from '@/components/ResourceHero';
import { pageMetadata, BUSINESS } from '@/lib/seo';
import { requestForms } from '@/lib/requestForms';
import { accountApplication } from '@/lib/accountApplication';

export const metadata = pageMetadata({
  title: 'Submit a Request | Teracom Solutions',
  description:
    'Book a service call, request a recorder password reset, or apply for a trade account with Teracom Solutions.',
  path: '/resources/submit-a-request',
});

const ICONS = { wrench: Wrench, key: KeyRound, account: Wallet };

// The account application is not one of the simple request forms -- it
// branches on entity and account type -- but on this page it is just
// another card.
const CARDS = [...requestForms, accountApplication];

export default function SubmitARequestPage() {
  return (
    <main id="main-content">
      <ResourceHero title="Submit a request" icon={ClipboardList} badges={[Wrench, KeyRound, Wallet]}>
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

          <div className="tools-grid request-grid">
            {CARDS.map((form) => {
              const Icon = ICONS[form.icon] || ClipboardList;
              return (
                <Link
                  href={`/resources/submit-a-request/${form.slug}`}
                  className="tool-card request-card"
                  key={form.slug}
                >
                  <span className="tool-card-icon">
                    <Icon size={26} strokeWidth={1.75} aria-hidden="true" focusable="false" />
                  </span>
                  <h3>{form.title}</h3>
                  <p>{form.lead}</p>
                  <span className="tool-card-cta">
                    Start this request <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className="tool-card-watermark" aria-hidden="true">
                    <Icon size={170} strokeWidth={1} />
                  </span>
                </Link>
              );
            })}

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
