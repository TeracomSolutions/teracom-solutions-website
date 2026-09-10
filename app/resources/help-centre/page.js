import Link from 'next/link';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import HelpCenterAccordion from '@/components/HelpCenterAccordion';

export const metadata = {
  title: 'Help Centre & FAQs | Teracom Solutions',
  description: 'Technical help articles covering the camera, recorder and app technology behind Teracom Solutions systems.',
};

export default function HelpCentre() {
  return (
    <main>
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">
              <Link href="/resources" style={{ color: 'inherit' }}>
                &larr; Resources
              </Link>
            </span>
            <h1>Help Centre & FAQs</h1>
            <p className="lead">
              We know that finding the right information can be difficult and time consuming. Below are our technical
              help articles -- if you can&apos;t find what you&apos;re after,{' '}
              <a href="/#contact" style={{ color: 'var(--text)', textDecoration: 'underline' }}>
                contact us
              </a>{' '}
              and we&apos;ll deal with your query promptly.
            </p>
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
