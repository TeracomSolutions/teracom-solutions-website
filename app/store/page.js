import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import CategoryIcon from '@/components/CategoryIcon';
import { cookies } from 'next/headers';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
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
// Deliberately an ItemList of products WITHOUT Offer/price nodes. This page
// hides pricing behind a sign-in (see `subscriptionProductsToShow` below --
// priceCents is nulled for anonymous visitors), and Googlebot crawls
// anonymously. Emitting prices a crawler-visiting user cannot actually see
// would be a structured-data/content mismatch and a Merchant policy problem,
// not a free rich result. If the price gate is ever lifted, add
// `offers: { '@type': 'Offer', price, priceCurrency: 'AUD', availability }`
// here and the Product rich results become available.
//
// Worth noting the gate itself is an SEO and conversion cost: a page with no
// visible price cannot rank for "<product> price" queries and gives visitors
// no reason to proceed. That is a commercial decision, not a bug, so it is
// flagged rather than changed here.
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
  const token = cookies().get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  
  const subscriptionProductsToShow = token
    ? subscriptionProducts
    : subscriptionProducts.map(p => ({ ...p, priceCents: null }));

  return <main id="main-content"><JsonLd schema={STORE_SCHEMA} /><section className="hero hero-product hero-shallow"><div className="container hero-layout"><div className="hero-copy"><span className="eyebrow">Teracom Store</span><h1>Security products, software and industry resources.</h1><p className="lead">A marketplace connecting security professionals with selected products, digital resources, training and Teracom AI subscriptions.</p><p className="gst-highlight">All prices displayed are inclusive of GST.</p></div></div></section><section className="section section-spacious"><div className="container"><div className="section-heading"><span className="eyebrow">Browse by category</span><h2>Shop by product category.</h2><p>Full catalogues are being rebuilt category by category -- browse what&apos;s here now, more stock and pricing is on its way.</p></div><div className="feature-grid">{categories.map(c=><Link href={`/store/${c.slug}`} key={c.slug} style={{textDecoration:'none',color:'inherit'}}><article><div className="category-heading-row"><div className="category-icon-badge"><CategoryIcon slug={c.slug}/></div><h3>{c.title}</h3></div><p>{c.description}</p></article></Link>)}</div></div></section><section className="section section-spacious alt"><div className="container"><div className="section-heading"><span className="eyebrow">Teracom AI Subscriptions</span><h2>Subscribe to Teracom AI.</h2><p>Monthly plans for AI support agents, scope generation, documentation and knowledge tools.</p></div><div className="product-grid">{subscriptionProductsToShow.map(p=><article className="product-card" key={p.id}><div><span className="badge">{p.type}</span><h3>{p.name}</h3><p>{p.description}</p></div><div>{p.priceCents === null ? (
        <>
          <p className="price">Sign in to view pricing</p>
          <Link href="/account/login" className="btn btn-primary">Sign in</Link>
        </>
      ) : (
        <>
          <p className="price">{formatMoney(p.priceCents)}<span className="price-gst-note"> inc. GST</span></p>
          <CheckoutButton productId={p.id} label="Subscribe" />
        </>
      )}</div></article>)}</div></div></section></main>}
