import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ClipboardSignature, FileCheck2, Mail, PenLine, ShieldCheck } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import OnlineForm from '@/components/OnlineForm';
import OrbitArt from '@/components/OrbitArt';
import { findOnlineForm } from '@/lib/onlineForms';
import { pageMetadata, BUSINESS } from '@/lib/seo';
import { TERMS_VERSION } from '@/lib/termsDocument';

// A form customers fill in and sign (lib/onlineForms). A form that is not live yet opens
// only with ?preview=1, is never indexed and is not in the sitemap.

async function formFor(props) {
  const params = await props.params;
  const search = (await props.searchParams) || {};
  const form = findOnlineForm(params.key);
  if (!form) return { form: null, preview: false };
  const preview = !form.live && search.preview === '1';
  if (!form.live && !preview) return { form: null, preview: false };
  return { form, preview };
}

export async function generateMetadata(props) {
  const { form } = await formFor(props);
  if (!form) return {};
  const metadata = pageMetadata({ title: `${form.title} | Teracom Solutions`, description: form.lead, path: `/forms/${form.key}` });
  return form.live ? metadata : { ...metadata, robots: { index: false, follow: false } };
}

export default async function OnlineFormPage(props) {
  const { form, preview } = await formFor(props);
  if (!form) notFound();

  return (
    <main id="main-content">
      {preview ? (
        <p className="draft-banner" role="status">Preview: this form is not live yet. Not public and not indexed.</p>
      ) : null}
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[{ name: 'Monitoring', href: '/monitoring' }]} current={form.shortTitle} />
            <span className="eyebrow">{form.eyebrow}</span>
            <h1>{form.title}</h1>
            <p className="lead">{form.lead}</p>
          </div>
          <OrbitArt icon={ClipboardSignature} badges={[PenLine, FileCheck2, ShieldCheck]} />
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
            <p className="form-note request-assurance">
              <ShieldCheck size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" /> You sign online at the end, and we
              email you a signed copy with your reference.
            </p>
            <p className="form-note request-assurance">
              <Mail size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" /> Questions? Email{' '}
              <a href={`mailto:${BUSINESS.salesEmail}`}>{BUSINESS.salesEmail}</a> or call {BUSINESS.telephoneDisplay}.
            </p>
            <p className="form-note request-assurance">
              <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" /> <Link href="/monitoring">Monitoring</Link>
            </p>
          </aside>

          <OnlineForm formKey={form.key} termsVersion={TERMS_VERSION} preview={preview} />
        </div>
      </section>
    </main>
  );
}
