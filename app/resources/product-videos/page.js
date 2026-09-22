import { Clapperboard, Film, MonitorPlay, Play } from 'lucide-react';
import ResourceHero from '@/components/ResourceHero';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import { resourcesIntros } from '@/lib/resourcesIntros';
import VideoGrid from '@/components/VideoGrid';

export const metadata = pageMetadata({
  title: 'Security Product Videos & Tutorials | Teracom Solutions',
  description: 'Installation, configuration and product overview videos from Teracom Solutions.',
  path: '/resources/product-videos',
});

export default function ProductVideos() {
  return (
    <main id="main-content">
      <ResourceHero title="Product Videos" icon={Clapperboard} badges={[Play, MonitorPlay, Film]}>
        <p className="lead">Installation, configuration and product overview videos.</p>
      </ResourceHero>
      <section className="section section-spacious">
        <div className="container">
          <div className="copy-block">
            {resourcesIntros['product-videos'].map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <ResourcesSubNav />
          <VideoGrid />
        </div>
      </section>
    </main>
  );
}
