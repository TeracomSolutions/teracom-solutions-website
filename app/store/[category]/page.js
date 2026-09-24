import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { findCategory, categories } from '@/lib/categories';
import { getProductsByCategory, getNewArrivals } from '@/lib/products';
import CategoryProductGrid from '@/components/CategoryProductGrid';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import Breadcrumbs from '@/components/Breadcrumbs';
import StoreCategoryArt from '@/components/StoreCategoryArt';
import { pageMetadata } from '@/lib/seo';
import { getCategoryContent } from '@/lib/categoryContent';
import { toolsForStoreCategory } from '@/lib/storeLinks';

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
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

export default async function CategoryPage(props) {
  const params = await props.params;
  const category = findCategory(params.category);
  if (!category) notFound();

  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  
  let products = category.isDynamic
    ? getNewArrivals()
    : category.productCategory
      ? getProductsByCategory(category.productCategory)
      : [];
  
  const content = getCategoryContent(category.slug);
  // The calculators are how most people arrive at needing this category
  // in the first place, so the listing links back to them.
  const relatedTools = toolsForStoreCategory(category.slug);

  return <main id="main-content"><section className="hero hero-product hero-shallow tool-hero"><div className="container hero-layout tool-hero-layout"><div className="hero-copy"><Breadcrumbs items={[{ name: 'Teracom Store', href: '/store' }]} current={category.title} /><span className="eyebrow">Teracom Store</span><h1>{category.title}</h1><p className="lead">{category.description}</p></div><StoreCategoryArt slug={category.slug} /></div></section>{content && (<>
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
  </>)}<section className="section section-spacious"><div className="container">{products.length > 0 ? <CategoryProductGrid products={products} isSignedIn={Boolean(token)} /> : <div className="category-quote-band"><h2>We stock {category.title.toLowerCase()} -- it is not all listed yet.</h2><p>We are rebuilding the catalogue category by category. In the meantime, tell us the spec or the part number and we will come back with current stock and a price, usually the same day.</p><div className="category-quote-actions"><Link className="btn btn-primary" href="/contact?interest=Teracom Store">Request a quote</Link><a className="btn btn-secondary" href="mailto:sales@teracomsolutions.com.au">Email sales@teracomsolutions.com.au</a></div></div>}</div></section>{relatedTools.length > 0 && (<section className="section section-spacious alt"><div className="container"><div className="section-heading"><span className="eyebrow">Size it first</span><h2>Free calculators for {category.title.toLowerCase()}.</h2><p>Work out what you actually need before you order. No sign-up, no email required.</p></div><div className="feature-grid">{relatedTools.map((tool) => (<Link href={`/tools/${tool.slug}`} key={tool.slug}><article><h3>{tool.title}</h3><p>{tool.description}</p></article></Link>))}</div></div></section>)}</main>;
}
