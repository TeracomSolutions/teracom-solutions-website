import Link from 'next/link';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import VideoGrid from '@/components/VideoGrid';

export const metadata = {
  title: 'Product Videos | Teracom Solutions',
  description: 'Installation, configuration and product overview videos from Teracom Solutions.',
};

export default function ProductVideos() {
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
            <h1>Product Videos</h1>
            <p className="lead">Installation, configuration and product overview videos.</p>
          </div>
        </div>
      </section>
      <section className="section section-spacious">
        <div className="container">
          <ResourcesSubNav />
          <VideoGrid />
        </div>
      </section>
    </main>
  );
}
