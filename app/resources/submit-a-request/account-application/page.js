import Link from 'next/link';
import { ArrowLeft, Mail, ShieldCheck, Wallet } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import AccountApplicationForm from '@/components/AccountApplicationForm';
import { pageMetadata, BUSINESS } from '@/lib/seo';
import { accountApplication } from '@/lib/accountApplication';

export const metadata = pageMetadata({
  title: accountApplication.seoTitle,
  description: accountApplication.description,
  path: '/resources/submit-a-request/account-application',
});

export default function AccountApplicationPage() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs
              items={[
                { name: 'Resources', href: '/resources' },
                { name: 'Submit a request', href: '/resources/submit-a-request' },
              ]}
              current={accountApplication.title}
            />
            <span className="eyebrow">Submit a request</span>
            <h1>{accountApplication.title}</h1>
            <p className="lead">{accountApplication.lead}</p>
          </div>
          <div className="tool-hero-art orbit-emblem" aria-hidden="true">
            <span className="tool-hero-ring">
              <Wallet size={96} strokeWidth={1.3} aria-hidden="true" focusable="false" />
            </span>
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container request-layout">
          <aside className="request-aside">
            <div className="copy-block">
              {accountApplication.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <p className="form-note request-assurance">
              <ShieldCheck size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" /> Approval is at our
              discretion, and we come back to you either way.
            </p>

            <p className="form-note request-assurance">
              <Mail size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" /> Questions about an
              application? Email <a href={`mailto:${BUSINESS.salesEmail}`}>{BUSINESS.salesEmail}</a>.
            </p>

            <p className="form-note request-assurance">
              <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" />{' '}
              <Link href="/resources/submit-a-request">All request forms</Link>
            </p>
          </aside>

          <AccountApplicationForm />
        </div>
      </section>
    </main>
  );
}
