// Single place that serialises page-level structured data, so individual pages
// declare *what* the schema is and never repeat the dangerouslySetInnerHTML /
// '@context' boilerplate (forgetting '@context' is exactly the bug that made
// this site's sitewide graph invisible to Google until 2026-09-15).
export default function JsonLd({ schema }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', ...schema }),
      }}
    />
  );
}
