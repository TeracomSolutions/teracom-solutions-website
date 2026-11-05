import Image from 'next/image';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import CategoryIcon from '@/components/CategoryIcon';
import { Bot } from 'lucide-react';
import { products, formatMoney } from '@/lib/products';
import { categories } from '@/lib/categories';
import JsonLd from '@/components/JsonLd';
import StoreSearchBox from '@/components/StoreSearchBox';
import { getAllProducts } from '@/lib/catalogue';
import { countSpecials } from '@/lib/specials';
import { fetchDepartmentCatalogue } from '@/lib/api/departmentCatalogue';
import { pageMetadata, SITE_ORIGIN, absoluteUrl } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Teracom Store | Technology Products, Software & Resources',
  description:
    'Buy security and technology products, digital resources, training and Teracom AI Departments. CCTV, access control, intrusion and intercom hardware from leading brands. Australian owned, prices include GST.',
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
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: absoluteUrl('/store/search') + '?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
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

// Rebuilt hourly so the specials banner follows the console's Specials page.
export const revalidate = 86400;

export default async function Store() {
  const specials = countSpecials(await getAllProducts());
  const aiPacks = (await fetchDepartmentCatalogue()).entries.length;
  // Prices are public (RRP inc. GST) for everyone. Signing up is pitched as the
  // way to unlock additional member discounts rather than the only way to see
  // a price -- a hidden price can't rank for "<product> price" searches and
  // gives a visitor no reason to go further.
  return <main id="main-content"><JsonLd schema={STORE_SCHEMA} /><section className="hero hero-product hero-shallow store-hero"><div className="container hero-layout mascot-hero"><div className="hero-copy"><span className="eyebrow">Teracom Store</span><h1>Security products, software and industry resources.</h1><p className="lead">A marketplace connecting security professionals with selected products, digital resources, training and Teracom AI Departments.</p><p className="gst-highlight store-gst">All prices shown are RRP, inclusive of GST.<br /><Link href="/account/signup" style={{color:'inherit',textDecoration:'underline'}}>Create a free account</Link> for additional member discounts.</p></div><div className="hero-mascot"><Image src="/assets/teracom-mascot-store.webp" alt="Teracom mascot giving a thumbs up" width={1024} height={1536} sizes="(max-width: 760px) 150px, 260px" priority /></div></div></section><section className="section store-search-section"><div className="container"><StoreSearchBox id="store-search" /><p className="search-count">Search by product name, brand or part number, or browse by category below.</p><Link className="store-specials-banner" href="/store/specials"><span className="store-specials-banner-tag">Specials &amp; clearance</span><span>{specials > 0 ? `${specials} product${specials === 1 ? '' : 's'} on special or clearance right now.` : 'See this week\'s specials and clearance stock.'}</span><span className="store-specials-banner-cta">Shop the specials →</span></Link><Link className="store-specials-banner store-ai-banner" href="/store/teracom-ai"><span className="store-specials-banner-tag">Teracom AI</span><span>{aiPacks} Departments and extension packs: AI digital workers for every part of your organisation.</span><span className="store-specials-banner-cta">Browse Teracom AI →</span></Link></div></section><section className="section section-spacious store-categories-section"><div className="container"><div className="section-heading"><span className="eyebrow">Browse by category</span><h2>Shop by product category.</h2><p>Full catalogues are being rebuilt category by category -- browse what&apos;s here now, more stock and pricing is on its way.</p></div><div className="feature-grid"><Link href="/store/teracom-ai"><article><div className="category-heading-row"><div className="category-icon-badge"><Bot size={22} aria-hidden="true" /></div><h3>Teracom AI</h3></div><p>Departments and extension packs: AI digital workers for finance, sales, operations, IT and more.</p></article></Link>{categories.map(c=><Link href={`/store/${c.slug}`} key={c.slug}><article><div className="category-heading-row"><div className="category-icon-badge"><CategoryIcon slug={c.slug}/></div><h3>{c.title}</h3></div><p>{c.description}</p></article></Link>)}</div></div></section></main>}
