import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import CategoryIcon from '@/components/CategoryIcon';
import { storeCategoriesForTool } from '@/lib/storeLinks';

/**
 * The band that turns a finished calculation into a shopping trip.
 *
 * Someone who has just worked out they need 14 TB of recording storage is as
 * close to buying a drive as they will ever be. Until now the calculator gave
 * them the number and no way to act on it.
 */
export default function ShopTheParts({ toolSlug }) {
  const shopCategories = storeCategoriesForTool(toolSlug);
  if (shopCategories.length === 0) return null;

  return (
    <section className="section section-spacious alt">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Now you have the number</span>
          <h2>Shop the parts.</h2>
          <p>Prices are shown to everyone. Sign in for member pricing, or ask us and we will quote the lot.</p>
        </div>
        <div className="feature-grid">
          {shopCategories.map((category) => (
            <Link href={`/store/${category.slug}`} key={category.slug}>
              <article>
                <div className="category-heading-row">
                  <div className="category-icon-badge">
                    <CategoryIcon slug={category.slug} />
                  </div>
                  <h3>{category.title}</h3>
                </div>
                <p>{category.description}</p>
              </article>
            </Link>
          ))}
        </div>
        <p className="form-note shop-the-parts-note">
          <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" /> Can&apos;t see what you
          need? <Link href="/contact">Tell us the spec</Link> and we will source it.
        </p>
      </div>
    </section>
  );
}
