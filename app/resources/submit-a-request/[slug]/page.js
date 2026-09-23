import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, KeyRound, Phone, ShieldCheck, Wrench } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import RequestForm from '@/components/RequestForm';
import { pageMetadata, BUSINESS } from '@/lib/seo';
import { charges, findRequestForm, requestForms } from '@/lib/requestForms';

const ICONS = { wrench: Wrench, key: KeyRound };

export function generateStaticParams() {
  return requestForms.map((form) => ({ slug: form.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const form = findRequestForm(params.slug);
  if (!form) return {};
  return pageMetadata({
    title: form.seoTitle,
    description: form.description,
    path: `/resources/submit-a-request/${form.slug}`,
  });
}

export default async function RequestFormPage(props) {
  const params = await props.params;
  const form = findRequestForm(params.slug);
  if (!form) notFound();

  const Icon = ICONS[form.icon] || ClipboardList;

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
              current={form.title}
            />
            <span className="eyebrow">Submit a request</span>
            <h1>{form.title}</h1>
            <p className="lead">{form.lead}</p>
          </div>
          <div className="tool-hero-art orbit-emblem" aria-hidden="true">
            <span className="tool-hero-ring">
              <Icon size={96} strokeWidth={1.3} aria-hidden="true" focusable="false" />
            </span>
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container request-layout">
          <aside className="request-aside">
            <div className="copy-block">
              {form.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            {charges.length > 0 ? (
              <div className="request-charges">
                <h2>Charges</h2>
                <dl>
                  {charges.map((charge) => (
                    <div key={charge.label}>
                      <dt>{charge.label}</dt>
                      <dd>
                        {charge.price}
                        {charge.note ? <span className="form-note">{charge.note}</span> : null}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            <p className="form-note request-assurance">
              <ShieldCheck size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" /> We confirm any charges
              with you before chargeable work starts.
            </p>

            <p className="form-note">
              Urgent? Call <a href={`tel:${BUSINESS.telephone}`}>{BUSINESS.telephoneDisplay}</a>,{' '}
              {BUSINESS.openingHours.opens}&ndash;{BUSINESS.openingHours.closes} Monday to Friday.
            </p>

            <p className="form-note">
              <Phone size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" />{' '}
              <Link href="/resources/submit-a-request">All request forms</Link>
            </p>
          </aside>

          <RequestForm form={form} />
        </div>
      </section>
    </main>
  );
}
