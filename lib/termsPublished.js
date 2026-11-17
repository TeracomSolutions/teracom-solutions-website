// Published terms versions, and the exact document each one was published as.
//
// Robert's rule, 2026-09-23: once a version is published, ANY change to the
// wording bumps the version number -- including a one-line tidy-up. The
// version string and the document must never disagree, because a customer's
// acceptance record names the version and a tribunal will ask what that
// version said.
//
// This file is how that rule is enforced rather than remembered. Each
// published entry records the fingerprint of the document as published; a
// test compares the current document against it and fails the build if the
// wording has moved without the version moving with it.
//
// TO PUBLISH A VERSION: set published to true and fill in publishedAt, in the
// same commit that makes the page live. Never edit the hash of a published
// entry -- if the document changed, it is a new version.

export const publishedTermsVersions = [
  {
    version: '3.3',
    effectiveDate: '2026-10-01',
    sourceFile: 'Teracom Terms and Conditions v3.3.docx',
    contentHash: 'a606a2b9ce8cb3f85915cde9febf2613fb92f1acc56b6841e4e7c1928a17bd5c',
    // PUBLISHED. Solicitor review confirmed by Robert on 25 September 2026
    // ("all ok from legal", approved as it stands), and published ahead of
    // the 1 October effective date.
    //
    // The wording is now frozen. v3.0 through v3.2 could be amended in place
    // because none of them was ever published; this one cannot. Any change
    // to the text from here -- including a one-line tidy-up -- is v3.4, with
    // its own entry below this one. The hash on this entry must never be
    // edited: if it no longer matches the document, the document changed and
    // the version did not, which is the exact failure this file exists to
    // prevent.
    published: true,
    publishedAt: '2026-09-25',
    supersedes: 'Terms and Conditions of Trade dated 9 September 2026',
  },
  {
    version: '3.4',
    effectiveDate: '2026-10-28',
    sourceFile: 'Teracom Terms and Conditions v3.4.docx',
    contentHash: '5456808cc4da80b39d5fc936f03aeb43dc3bbed7359c6055b141211e54f9f902',
    // PUBLISHED on Robert's instruction of 28 October 2026 ("change them as well"): the three clauses that said
    // operating systems now say Departments, Industry Packs and Extensions (Teracom Product Model V1), with the
    // cover, footer, example record and version history updated. No change to either party's rights or
    // obligations. Frozen like v3.3: any further change is v3.5.
    published: true,
    publishedAt: '2026-10-28',
    supersedes: 'Terms and Conditions of Trade v3.3',
  },
  {
    version: '3.5',
    effectiveDate: '2026-11-17',
    sourceFile: 'Teracom Terms and Conditions v3.5.docx',
    contentHash: '68877f3b33ec028fe90ce665cc40090ec2f3e3cc068a98a0d7c463ef93dcb8fe',
    // PUBLISHED on Robert's instruction of 17 November 2026 ("just apply 3.5, just get moving"; there are no
    // existing Teracom AI customers to move across): adds Schedule 4 clause 4.13, platform improvement
    // information (the counts and scores a Teracom AI system sends Teracom, never customer content), with the
    // cover, transition clause, example record and version history updated. Frozen: any further change is v3.6.
    published: true,
    publishedAt: '2026-11-17',
    supersedes: 'Terms and Conditions of Trade v3.4',
  },
];

export function findPublishedVersion(version) {
  return publishedTermsVersions.find((entry) => entry.version === version) || null;
}

export function isPublished(version) {
  const entry = findPublishedVersion(version);
  return Boolean(entry && entry.published);
}
