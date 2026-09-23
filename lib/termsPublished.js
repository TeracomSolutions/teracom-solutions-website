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
    version: '3.0',
    effectiveDate: '2026-10-01',
    sourceFile: 'Teracom Terms and Conditions v3.0.docx',
    contentHash: '57891a15e3a68ac3f227e19b2d57c3b3ebfc18536773e557083441ade843606b',
    // Not live yet: the draft is waiting on Robert's confirmation of the
    // solicitor review. While this is false the document may still be
    // amended in place, which is why the amendments made on 23 September
    // were legitimate. The moment it flips, the wording is frozen.
    published: false,
    publishedAt: null,
    supersedes: 'Terms and Conditions of Trade dated 9 September 2026',
  },
];

export function findPublishedVersion(version) {
  return publishedTermsVersions.find((entry) => entry.version === version) || null;
}

export function isPublished(version) {
  const entry = findPublishedVersion(version);
  return Boolean(entry && entry.published);
}
