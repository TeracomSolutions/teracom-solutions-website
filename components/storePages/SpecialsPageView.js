import Link from 'next/link';
import { BadgePercent, Flame, Tag } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import CategoryProductGrid from '@/components/CategoryProductGrid';
import OrbitArt from '@/components/OrbitArt';
import { getAllProducts, getCustomerPricing } from '@/lib/catalogue';
import { forTiles } from '@/lib/catalogueMerge';
import { pageMetadata } from '@/lib/seo';
import { PROMO_KINDS, specialsByKind } from '@/lib/specials';

export const specialsMetadata = pageMetadata({
  title: 'Specials & Clearance: Security, AV and IT Deals | Teracom Solutions',
  description: 'Hot specials and clearance prices on security, AV and IT products from the Teracom Store, for a limited time and while stocks last.',
  path: '/store/specials',
});

// /store/specials (Robert, 2026-11-02): everything on special or clearance, set on
// the console's Specials page. The signed-in copy shows each customer's own price;
// guests get the saved copy at /g/store/specials (proxy.js).
export default async function SpecialsPageView(token) {
  const [products, customer] = await Promise.all([getAllProducts(), getCustomerPricing(token)]);
  const byKind = specialsByKind(products);
  const total = Object.values(byKind).reduce((n, list) => n + list.length, 0);

  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[{ name: 'Teracom Store', href: '/store' }]} current="Specials & clearance" />
            <span className="eyebrow">Teracom Store</span>
            <h1>Specials &amp; clearance.</h1>
            <p className="lead">
              Hot specials for a limited time and clearance stock at clearance prices. Prices include GST; the price each item
              was before is shown beside it.
            </p>
          </div>
          <OrbitArt icon={BadgePercent} badges={[Flame, Tag, BadgePercent]} />
        </div>
      </section>

      {total === 0 ? (
        <section className="section section-spacious">
          <div className="container specials-empty">
            <h2>No specials running right now.</h2>
            <p>New specials and clearance stock go up regularly. Browse the store in the meantime, or ask us for a price on anything you need.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/store">Browse the store</Link>
              <Link className="btn btn-secondary" href="/contact?interest=Teracom Store">Ask for a price</Link>
            </div>
          </div>
        </section>
      ) : (
        PROMO_KINDS.filter((k) => byKind[k.kind].length).map((k, i) => (
          <section className={`section section-spacious${i % 2 ? ' alt' : ''}`} key={k.kind} id={k.kind}>
            <div className="container">
              <div className="section-heading left">
                <span className={`eyebrow specials-eyebrow specials-${k.kind}`}>{k.eyebrow}</span>
                <h2>{k.title}</h2>
                <p>{k.blurb}</p>
              </div>
              <CategoryProductGrid products={forTiles(byKind[k.kind], customer)} isSignedIn={Boolean(customer)} customer={customer} categoryTitle={k.title} />
            </div>
          </section>
        ))
      )}
    </main>
  );
}
