import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { findCategory, categories } from '@/lib/categories';
import { getProductsByCategory } from '@/lib/products';
import CategoryProductGrid from '@/components/CategoryProductGrid';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const category = findCategory(params.category);
  if (!category) return {};
  return {
    title: `${category.title} | Teracom Store`,
    description: category.description,
  };
}

export default function CategoryPage({ params }) {
  const category = findCategory(params.category);
  if (!category) notFound();

  const token = cookies().get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  
  let products = category.productCategory ? getProductsByCategory(category.productCategory) : [];
  
  if (!token) {
    products = products.map(p => ({ ...p, priceCents: null }));
  }

  return <main><section className="hero hero-product hero-shallow"><div className="container hero-layout"><div className="hero-copy"><span className="eyebrow"><Link href="/store" style={{color:'inherit'}}>&larr; Teracom Store</Link></span><h1>{category.title}</h1><p className="lead">{category.description}</p></div></div></section><section className="section section-spacious"><div className="container">{products.length > 0 ? <CategoryProductGrid products={products} /> : <div className="form-note-banner" role="status">Full product listings for {category.title} are coming soon. In the meantime, <Link href="/#contact" style={{color:'var(--text)',textDecoration:'underline'}}>contact us</Link> for current stock and pricing.</div>}</div></section></main>;
}
