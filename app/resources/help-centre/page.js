import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import Breadcrumbs from '@/components/Breadcrumbs';
import HelpCenterAccordion from '@/components/HelpCenterAccordion';
import CategoryIcon from '@/components/CategoryIcon';
import JsonLd from '@/components/JsonLd';
import { helpCenterTopics } from '@/lib/helpCenterTopics';

export const metadata = pageMetadata({
  title: 'CCTV & Security Help Centre, FAQs | Teracom Solutions',
  description: 'Technical help articles covering the camera, recorder and app technology behind Teracom Solutions systems.',
  path: '/resources/help-centre',
});


// FAQPage over the 70 real question/answer pairs across the 9 help topics in
// lib/helpCenterTopics.js (recovered from the previous site's technical-help
// articles). This is the densest piece of genuinely useful, keyword-rich
// content on the site and it was previously invisible as structured data.
//
// Honest note on expectations: Google restricted the *visual* FAQ rich result
// in 2023 to authoritative government and health sites, so this is unlikely
// to produce expandable FAQ snippets for Teracom. It is still worth emitting
// -- it gives crawlers and AI answer engines an unambiguous machine-readable
// map of which question each answer belongs to, which is exactly what gets
// quoted in assistant answers and "People also ask" style surfaces.
const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: helpCenterTopics.flatMap((topic) =>
    (topic.faqs || []).map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    }))
  ),
};

export default function HelpCentre() {
  return (
    <main id="main-content">
      <JsonLd schema={FAQ_SCHEMA} />
      <section className="hero hero-product hero-shallow">
        <div className="container help-hero-row">
          <div className="hero-copy">
            <Breadcrumbs
              items={[{ name: 'Resources', href: '/resources' }]}
              current={'Help Centre & FAQs'}
            />
            <h1>Help Centre & FAQs</h1>
            <p className="lead">
              We know that finding the right information can be difficult and time consuming. Below are our technical
              help articles -- if you can&apos;t find what you&apos;re after,{' '}
              <Link href="/#contact" style={{ color: 'var(--text)', textDecoration: 'underline' }}>
                contact us
              </Link>{' '}
              and we&apos;ll deal with your query promptly.
            </p>
          </div>
          <div className="help-hero-graphic" aria-hidden="true">
            <CategoryIcon slug="help" />
          </div>
        </div>
      </section>
      <section className="section section-spacious">
        <div className="container">
          <ResourcesSubNav />
          <HelpCenterAccordion />
        </div>
      </section>
    </main>
  );
}
