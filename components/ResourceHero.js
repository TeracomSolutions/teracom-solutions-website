import { BookOpen, FileText, LifeBuoy } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import OrbitArt from '@/components/OrbitArt';

// Hero for the /resources sub-pages: breadcrumbs, title and lead on the left,
// the page's emblem with three badges orbiting it on the right (OrbitArt,
// the same moving look as every other hero).
export default function ResourceHero({ title, icon: Icon, badges = [], children }) {
  return (
    <section className="hero hero-product hero-shallow tool-hero">
      <div className="container hero-layout tool-hero-layout">
        <div className="hero-copy">
          <Breadcrumbs items={[{ name: 'Resources', href: '/resources' }]} current={title} />
          <span className="eyebrow">Resources</span>
          <h1>{title}</h1>
          {children}
        </div>
        <OrbitArt icon={Icon} badges={badges.length ? badges : [BookOpen, FileText, LifeBuoy]} />
      </div>
    </section>
  );
}
