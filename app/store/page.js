import Image from 'next/image';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import CategoryIcon from '@/components/CategoryIcon';
import { products, formatMoney } from '@/lib/products';
import { categories } from '@/lib/categories';
import JsonLd from '@/components/JsonLd';
import { pageMetadata, SITE_ORIGIN, absoluteUrl } from '@/lib/seo';

const subscriptionProducts = products.filter(p => p.type === 'subscription');


export const metadata = pageMetadata({
  title: 'Teracom Store | Security Products, Software & Resources',
  description:
    'Buy security products, digital resources, training and Teracom AI subscriptions. CCTV, access control, intrusion and intercom hardware from leading brands. Australian owned, prices include GST.',
  path: '/store',
});

// Structured data for the store landing page.
//
// An ItemList of categories, not products, so there are no Offer/price nodes
// here. Prices are now public (RRP inc. GST, 2026-09-22 decision), so Product +
// Offer markup becomes possible once individual product pages exist -- add
// `offers: { '@type': 'Offer', price, priceCurrency: 'AUD', availability }`
// on those pages rather than on this category list.
const STORE_SCHEMA = {
  '@type': 'CollectionPage',
  name: 'Teracom Store',
  url: absoluteUrl('/store'),
  isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
  about: { '@id': `${SITE_ORIGIN}/#organisation` },
  mainEntity: {
    '@type': 'ItemList',
    name: 'Teracom Store product categories',
    itemListElement: categories.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: category.title,
      url: absoluteUrl(`/store/${category.slug}`),
    })),
  },
};

export default function Store() {
  // Prices are public (RRP inc. GST) for everyone. Signing up is pitched as the
  // way to unlock additional member discounts rather than the only way to see
  // a price -- a hidden price can't rank for "<product> price" searches and
  // gives a visitor no reason to go further.
  const subscriptionProductsToShow = subscriptionProducts;

  return <main id="main-content"><JsonLd schema={STORE_SCHEMA} /><section className="hero hero-product hero-shallow"><div className="container hero-layout mascot-hero"><div className="hero-copy"><span className="eyebrow">Teracom Store</span><h1>Security products, software and industry resources.</h1><p className="lead">A marketplace connecting security professionals with selected products, digital resources, training and Teracom AI subscriptions.</p><p className="gst-highlight">All prices shown are RRP, inclusive of GST. <Link href="/account/signup" style={{color:'inherit',textDecoration:'underline'}}>Create a free account</Link> for additional member discounts.</p></div><div className="hero-mascot"><Image src="/assets/teracom-mascot-store.webp" alt="Teracom mascot giving a thumbs up" width={1024} height={1536} sizes="(max-width: 760px) 150px, 260px" priority /></div></div></section><section className="section section-spacious"><div className="container"><div className="section-heading"><span className="eyebrow">Browse by category</span><h2>Shop by product category.</h2><p>Full catalogues are being rebuilt category by category -- browse what&apos;s here now, more stock and pricing is on its way.</p></div><div className="feature-grid">{categories.map(c=><Link href={`/store/${c.slug}`} key={c.slug} style={{textDecoration:'none',color:'inherit'}}><article><div className="category-heading-row"><div className="category-icon-badge"><CategoryIcon slug={c.slug}/></div><h3>{c.title}</h3></div><p>{c.description}</p></article></Link>)}</div></div></section><section className="section section-spacious alt"><div className="container"><div className="section-heading"><span className="eyebrow">Teracom AI Subscriptions</span><h2>Subscribe to Teracom AI.</h2><p>Monthly plans for AI support agents, scope generation, documentation and knowledge tools.</p></div><div className="product-grid">{subscriptionProductsToShow.map(p=><article className="product-card" key={p.id}><div><span className="badge">{p.type}</span><h3>{p.name}</h3><p>{p.description}</p></div><div>{p.priceCents === null ? (
        <>
          <p className="price">Sign in to view pricing</p>
          <Link href="/account/login" className="btn btn-primary">Sign in</Link>
        </>
      ) : (
        <>
          <p className="price">{formatMoney(p.priceCents)}<span className="price-gst-note"> inc. GST / month</span></p>
          <CheckoutButton productId={p.id} label="Subscribe" />
        </>
      )}</div></article>)}</div></div></section></main>}
