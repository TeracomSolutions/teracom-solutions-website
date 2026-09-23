import Link from 'next/link';
import { Archive } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import TermsDocument from '@/components/TermsDocument';
import { NOINDEX, pageMetadata, BUSINESS } from '@/lib/seo';
import {
  TERMS_CONTENT_SHA256,
  TERMS_EFFECTIVE,
  TERMS_VERSION,
  termsAcceptanceRecord,
  termsParts,
  termsVersionHistory,
} from '@/lib/termsDocument';

// The permanent copy of version 3.0.
//
// Acceptance records point here, not at /terms, because /terms is whatever
// the current terms happen to be and a record that resolves to today's
// wording proves nothing. While 3.0 IS current, this renders the same
// document module. WHEN A NEW VERSION IS GENERATED: copy lib/termsDocument.js
// to lib/terms/v3-0.js first and point this page at the copy, before
// regenerating. Otherwise this URL silently starts showing v4.0 and every
// stored acceptance of v3.0 becomes unprovable.
//
// Noindex so only one set of terms appears in search results; the page is
// evidence, not marketing.

export const metadata = {
  ...pageMetadata({
    title: `Terms & Conditions v${TERMS_VERSION} | Teracom Solutions`,
    description: `Permanent copy of the Teracom Solutions Terms and Conditions of Trade version ${TERMS_VERSION}, effective ${TERMS_EFFECTIVE}.`,
    path: `/terms/v${TERMS_VERSION}`,
  }),
  ...NOINDEX,
};

export default function TermsVersionPage() {
  return (
    <main id="main-content" className="terms-page">
      <section className="section">
        <div className="container terms-single">
          <Breadcrumbs items={[{ name: 'Terms & Conditions', href: '/terms' }]} current={`Version ${TERMS_VERSION}`} />
          <span className="eyebrow">Legal</span>
          <h1>Terms and Conditions of Trade</h1>
          <p className="terms-version">
            ABN {BUSINESS.abn} &nbsp;|&nbsp; Version {TERMS_VERSION} &nbsp;|&nbsp; Effective {TERMS_EFFECTIVE}
          </p>

          <p className="form-note-banner" role="note">
            <Archive size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" /> This is the permanent copy of
            version {TERMS_VERSION}, kept so that an acceptance of this version can always be read back. The terms
            currently in force are at <Link href="/terms">/terms</Link>.
          </p>

          <article className="terms-body">
            <TermsDocument parts={termsParts} />

            {termsAcceptanceRecord.length > 0 ? (
              <table className="terms-table">
                <caption className="visually-hidden">
                  The record Teracom keeps for each electronic acceptance of these terms
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Field</th>
                    <th scope="col">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {termsAcceptanceRecord.map((row) => (
                    <tr key={row.field}>
                      <th scope="row">{row.field}</th>
                      <td>{row.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}

            {termsVersionHistory ? <p className="terms-history">{termsVersionHistory}</p> : null}

            <p className="form-note terms-hash">
              Document fingerprint (SHA-256): <code>{TERMS_CONTENT_SHA256}</code>
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
