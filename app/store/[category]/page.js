import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findCategory, categories } from '@/lib/categories';
import { getProductsByCategory, formatMoney } from '@/lib/products';
import CheckoutButton from '@/components/CheckoutButton';

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

  const products = category.productCategory ? getProductsByCategory(category.productCategory) : [];

  return <main><section className="hero hero-product"><div className="container hero-layout"><div className="hero-copy"><span className="eyebrow"><Link href="/store" style={{color:'inherit'}}>Teracom Store</Link></span><h1>{category.title}</h1><p className="lead">{category.description}</p></div></div></section><section className="section section-spacious"><div className="container">{products.length > 0 ? <div className="product-grid">{products.map((p) => <article className="product-card" key={p.id}><div><span className="badge">{p.type}</span><h3>{p.name}</h3><p>{p.description}</p></div><div><p className="price">{formatMoney(p.priceCents)}</p><CheckoutButton productId={p.id} label={p.type === 'subscription' ? 'Subscribe' : 'Buy'} /></div></article>)}</div> : <div className="form-note-banner" role="status">Full product listings for {category.title} are coming soon. In the meantime, <Link href="/#contact" style={{color:'var(--text)',textDecoration:'underline'}}>contact us</Link> for current stock and pricing.</div>}</div></section></main>;
}
