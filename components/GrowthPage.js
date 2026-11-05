import Link from 'next/link';

import JsonLd from '@/components/JsonLd';
import { paragraphs } from '@/lib/api/growthPublic';

// One area page or project case study (growth tools 3 and 4): the text, the
// details staff gave, the photos and a way to get in touch.
export default function GrowthPage({ eyebrow, item, facts, schema, back }) {
  const photos = (item.data && item.data.photos) || [];
  return (
    <main id="main-content">
      {schema ? <JsonLd schema={schema} /> : null}
      <section className="hero hero-product hero-shallow">
        <div className="container">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{item.title}</h1>
          {item.summary ? <p className="lead">{item.summary}</p> : null}
        </div>
      </section>
      <section className="section">
        <div className="container growth-public">
          <div className="growth-public-text">
            {paragraphs(item.body).map((p, i) => <p key={i}>{p}</p>)}
            <p><Link href="/contact" className="btn btn-primary">Ask for a quote</Link></p>
          </div>
          {facts.filter((f) => f.value).length > 0 ? (
            <dl className="growth-public-facts">
              {facts.filter((f) => f.value).map((f) => (
                <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
              ))}
            </dl>
          ) : null}
        </div>
        {photos.length > 0 ? (
          <div className="container growth-public-photos">
            {photos.map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={photo.file} src={photo.url} alt={photo.caption || item.title} loading="lazy" />
            ))}
          </div>
        ) : null}
        <div className="container"><p><Link href={back.href} className="admin-link">&larr; {back.label}</Link></p></div>
      </section>
    </main>
  );
}

// The list pages: a card per area or project.
export function GrowthList({ eyebrow, title, lead, items, base }) {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow">
        <div className="container">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="lead">{lead}</p>
        </div>
      </section>
      <section className="section">
        <div className="container growth-public-cards">
          {items.map((item) => {
            const photo = item.data && item.data.photos && item.data.photos[0];
            return (
              <Link key={item.slug} href={`${base}${item.slug}`} className="growth-public-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {photo ? <img src={photo.url} alt="" loading="lazy" /> : null}
                <strong>{item.title}</strong>
                {item.summary ? <span>{item.summary}</span> : null}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
