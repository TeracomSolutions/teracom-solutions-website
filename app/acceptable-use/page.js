import Link from 'next/link';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/Breadcrumbs';
import { TermsBlocks } from '@/components/TermsDocument';
import { pageMetadata } from '@/lib/seo';
import { TERMS_EFFECTIVE, TERMS_VERSION, findTermsPart } from '@/lib/termsDocument';

// Schedule 5 rendered on its own. It is referenced from the Platform terms
// and from suspension notices, and a policy someone has to scroll a
// seventeen-page contract to find is a policy nobody reads.

export const metadata = pageMetadata({
  title: 'Acceptable Use Policy | Teracom Solutions',
  description:
    'What the Teracom AI platform and Teracom services may and may not be used for. Schedule 5 of the Teracom Solutions Terms and Conditions of Trade.',
  path: '/acceptable-use',
});

export default function AcceptableUsePage() {
  const schedule = findTermsPart('schedule-5');
  if (!schedule) notFound();

  return (
    <main id="main-content" className="terms-page">
      <section className="section">
        <div className="container terms-single">
          <Breadcrumbs items={[{ name: 'Terms & Conditions', href: '/terms' }]} current="Acceptable Use Policy" />
          <span className="eyebrow">Legal</span>
          <h1>Acceptable Use Policy</h1>
          <p className="terms-version">
            Schedule 5 of the Terms and Conditions of Trade &nbsp;|&nbsp; Version {TERMS_VERSION} &nbsp;|&nbsp;
            Effective {TERMS_EFFECTIVE}
          </p>

          <article className="terms-body">
            {schedule.sections.map((section) => (
              <TermsBlocks blocks={section.blocks} key={section.id} />
            ))}

            <p className="form-note">
              This policy forms part of the{' '}
              <Link href="/terms#schedule-5">Teracom Solutions Terms and Conditions of Trade</Link>. Part A of those
              terms covers liability, privacy and how disputes are resolved.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
