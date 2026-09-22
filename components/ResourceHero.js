import Breadcrumbs from '@/components/Breadcrumbs';

// Hero for the /resources sub-pages: breadcrumbs, title and lead on the left,
// a glowing emblem with up to three orbiting badges on the right (same look
// as the tools, services, legal and warranty heroes).
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
        <div className="tool-hero-art orbit-emblem" aria-hidden="true">
          <span className="tool-hero-ring">
            <Icon size={96} strokeWidth={1.3} aria-hidden="true" focusable="false" />
          </span>
          {badges.slice(0, 3).map((Badge, i) => (
            <span className={`orbit-sat orbit-sat-${i + 1}`} key={i}>
              <Badge size={22} strokeWidth={1.8} aria-hidden="true" focusable="false" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
