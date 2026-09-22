import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { findCategory, categories } from '@/lib/categories';
import { getProductsByCategory, getNewArrivals } from '@/lib/products';
import CategoryProductGrid from '@/components/CategoryProductGrid';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import Breadcrumbs from '@/components/Breadcrumbs';
import { pageMetadata } from '@/lib/seo';
import { getCategoryContent } from '@/lib/categoryContent';

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const category = findCategory(params.category);
  if (!category) return {};
  // Canonical matters most here: a category listing is the natural target for
  // filter/sort query strings, and without one every ?param variant is a
  // separate, competing URL in Google's index.
  return pageMetadata({
    title: category.seoTitle || `${category.title} | Teracom Store`,
    description: category.description,
    path: `/store/${category.slug}`,
  });
}

export default function CategoryPage({ params }) {
  const category = findCategory(params.category);
  if (!category) notFound();

  const token = cookies().get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  
  let products = category.isDynamic
    ? getNewArrivals()
    : category.productCategory
      ? getProductsByCategory(category.productCategory)
      : [];
  
  const content = getCategoryContent(category.slug);

  return <main id="main-content"><section className="hero hero-product hero-shallow"><div className="container hero-layout"><div className="hero-copy"><Breadcrumbs items={[{ name: 'Teracom Store', href: '/store' }]} current={category.title} /><h1>{category.title}</h1><p className="lead">{category.description}</p></div></div></section>{content && (<>
    <section className="section section-spacious">
      <div className="container">
        <div className="copy-block">
          {content.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <h2>What to consider</h2>
        <ul className="tick-list">
          {content.considerations.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
        <p>Not sure what you need? <Link href='/contact'>Talk to our team</Link> for advice before you buy.</p>
      </div>
    </section>
  </>)}<section className="section section-spacious"><div className="container">{products.length > 0 ? <CategoryProductGrid products={products} isSignedIn={Boolean(token)} /> : <div className="form-note-banner" role="status">Full product listings for {category.title} are coming soon. In the meantime, <Link href="/contact" style={{color:'var(--text)',textDecoration:'underline'}}>contact us</Link> for current stock and pricing.</div>}</div></section></main>;
}
