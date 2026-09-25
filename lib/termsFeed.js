import { SITE_ORIGIN } from './seo.js';
import { ACCEPTANCE_CONTEXTS, termsRegistry } from './termsRegistry.js';
import { publishedTermsVersions } from './termsPublished.js';

// The terms version registry, as the Teracom AI platform consumes it.
//
// Versions are published here, on the website, so this is their single
// source. The platform reads version, effective date, URL and fingerprint
// from this feed rather than keeping its own copy -- two copies of a version
// string is how a stored acceptance ends up naming a version that was never
// published.
//
// It FAILS CLOSED: a version that has not been published is reported as a
// draft and never as current, and `documents` is empty until something is
// live. A consumer that only ever writes acceptance rows from `documents`
// cannot record an acceptance of terms nobody can read yet.

function absolute(path) {
  return `${SITE_ORIGIN}${path}`;
}

function describeVersion(entry) {
  return {
    version: entry.version,
    effectiveDate: entry.effectiveDate,
    sourceFile: entry.sourceFile,
    contentHash: entry.contentHash,
    published: entry.published,
    publishedAt: entry.publishedAt,
    supersedes: entry.supersedes || null,
    url: absolute(`/terms/v${entry.version}`),
  };
}

function describeDocument(doc) {
  return {
    key: doc.key,
    title: doc.title,
    version: doc.version,
    effectiveDate: doc.effectiveDate,
    contentHash: doc.contentHash,
    anchor: doc.anchor,
    url: absolute(doc.url),
  };
}

export function buildTermsFeed() {
  const published = publishedTermsVersions.filter((entry) => entry.published);
  // Newest by effective date; ties broken by version so the order is stable.
  const sorted = [...published].sort(
    (a, b) => b.effectiveDate.localeCompare(a.effectiveDate) || b.version.localeCompare(a.version)
  );
  const current = sorted[0] || null;

  const registryMatchesCurrent = Boolean(current && termsRegistry[0]?.version === current.version);

  return {
    // Whether anything is live. A consumer should treat false as "do not
    // record acceptances yet", not as an error.
    live: Boolean(current),
    current: current ? describeVersion(current) : null,
    // Only ever the documents of the live version.
    documents: registryMatchesCurrent ? termsRegistry.map(describeDocument) : [],
    // Which documents each acceptance context records a row for. One
    // submission is several rows: a monitoring application accepts the
    // general terms and Schedule 3.
    contexts: ACCEPTANCE_CONTEXTS,
    // Visible so the platform team can build against it before go-live,
    // clearly separated so nothing treats it as acceptable to record.
    draft:
      !current && termsRegistry[0]
        ? {
            ...describeVersion(
              publishedTermsVersions.find((entry) => entry.version === termsRegistry[0].version) || {
                version: termsRegistry[0].version,
                effectiveDate: termsRegistry[0].effectiveDate,
                sourceFile: termsRegistry[0].sourceFile,
                contentHash: termsRegistry[0].contentHash,
                published: false,
                publishedAt: null,
              }
            ),
            documents: termsRegistry.map(describeDocument),
          }
        : null,
    versions: publishedTermsVersions.map(describeVersion),
  };
}
