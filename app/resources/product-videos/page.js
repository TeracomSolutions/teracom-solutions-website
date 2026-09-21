import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import Breadcrumbs from '@/components/Breadcrumbs';
import VideoGrid from '@/components/VideoGrid';

export const metadata = pageMetadata({
  title: 'Security Product Videos & Tutorials | Teracom Solutions',
  description: 'Installation, configuration and product overview videos from Teracom Solutions.',
  path: '/resources/product-videos',
});

export default function ProductVideos() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <Breadcrumbs
              items={[{ name: 'Resources', href: '/resources' }]}
              current={'Product Videos'}
            />
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
