import Link from 'next/link';
import { notFound } from 'next/navigation';
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
import { publishedTermsVersions } from '@/lib/termsPublished';

// The permanent, versioned copy an acceptance record points at.
//
// A dynamic segment rather than a folder per version, because a folder named
// v3.0 does not follow the document when it becomes v3.1 -- every URL in the
// registry would 404 and nobody would notice until a customer clicked one in
// their own acceptance record.
//
// WHEN A NEW VERSION IS GENERATED: copy lib/termsDocument.js to a frozen
// module first, add it to the lookup below, then regenerate. Until that is
// done, an older version returns 404 rather than quietly serving the current
// text under the old version's URL -- being unable to read a superseded
// version is a problem you notice; being shown the wrong one silently is not.

export function generateStaticParams() {
  return publishedTermsVersions.map((entry) => ({ version: `v${entry.version}` }));
}

function documentFor(version) {
  if (version !== TERMS_VERSION) return null;
  return { parts: termsParts, acceptanceRecord: termsAcceptanceRecord, history: termsVersionHistory };
}

export async function generateMetadata(props) {
  const params = await props.params;
  const version = String(params.version || '').replace(/^v/, '');
  if (!documentFor(version)) return {};
  return {
    ...pageMetadata({
      title: `Terms & Conditions v${version} | Teracom Solutions`,
      description: `Permanent copy of the Teracom Solutions Terms and Conditions of Trade version ${version}, effective ${TERMS_EFFECTIVE}.`,
      path: `/terms/v${version}`,
    }),
    // Only one set of terms belongs in search results; this page is evidence.
    ...NOINDEX,
  };
}

export default async function TermsVersionPage(props) {
  const params = await props.params;
  const version = String(params.version || '').replace(/^v/, '');
  const document = documentFor(version);
  if (!document) notFound();

  return (
    <main id="main-content" className="terms-page">
      <section className="section">
        <div className="container terms-single">
          <Breadcrumbs items={[{ name: 'Terms & Conditions', href: '/terms' }]} current={`Version ${version}`} />
          <span className="eyebrow">Legal</span>
          <h1>Terms and Conditions of Trade</h1>
          <p className="terms-version">
            ABN {BUSINESS.abn} &nbsp;|&nbsp; Version {version} &nbsp;|&nbsp; Effective {TERMS_EFFECTIVE}
          </p>

          <p className="form-note-banner" role="note">
            <Archive size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" /> This is the permanent copy of
            version {version}, kept so that an acceptance of this version can always be read back. The terms currently
            in force are at <Link href="/terms">/terms</Link>.
          </p>

          <article className="terms-body">
            <TermsDocument parts={document.parts} />

            {document.acceptanceRecord.length > 0 ? (
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
                  {document.acceptanceRecord.map((row) => (
                    <tr key={row.field}>
                      <th scope="row">{row.field}</th>
                      <td>{row.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}

            {document.history ? <p className="terms-history">{document.history}</p> : null}

            <p className="form-note terms-hash">
              Document fingerprint (SHA-256): <code>{TERMS_CONTENT_SHA256}</code>
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
