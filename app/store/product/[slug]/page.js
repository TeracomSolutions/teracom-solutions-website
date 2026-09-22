import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Headset, PackageSearch, ReceiptText, ShieldCheck, Truck } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import AddToCartButton from '@/components/AddToCartButton';
import CheckoutButton from '@/components/CheckoutButton';
import StoreCategoryArt from '@/components/StoreCategoryArt';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import {
  artSlugForProduct,
  exGstCents,
  findProductBySlug,
  formatMoney,
  getRelatedProducts,
  memberPriceCents,
  productPath,
  products,
  storeCategoryForProduct,
} from '@/lib/products';
import { absoluteUrl, BUSINESS, pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.id }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const product = findProductBySlug(params.slug);
  if (!product) return {};
  // The part number earns its place in the description: searching a part
  // number is how a trade buyer looks for a supplier.
  const description =
    `${product.description} Part number ${product.sku}. Priced in AUD inclusive of GST.`.slice(0, 155);
  return pageMetadata({
    title: `${product.name} | Teracom Store`,
    description,
    path: productPath(product),
  });
}

// Every line here has to be something the business actually does today.
// A tax-invoice promise was deliberately left out: Stripe sends a receipt,
// not an ATO-compliant tax invoice, so claiming one would be a false
// representation until that is built.
const ASSURANCES = [
  { icon: ShieldCheck, text: 'Warranty support handled locally' },
  { icon: ReceiptText, text: 'Priced in AUD, GST included, no card surcharge' },
  { icon: Truck, text: 'Flat-rate delivery Australia-wide' },
  { icon: Headset, text: 'Technical advice before you buy' },
];

export default async function ProductPage(props) {
  const params = await props.params;
  const product = findProductBySlug(params.slug);
  if (!product) notFound();

  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  const isSignedIn = Boolean(token);
  const category = storeCategoryForProduct(product);
  const related = getRelatedProducts(product);
  const isSubscription = product.type === 'subscription';
  const showMemberPrice = isSignedIn && !isSubscription;
  const price = showMemberPrice ? memberPriceCents(product) : product.priceCents;

  // Product structured data. `availability` is asserted only for things that
  // are always available -- subscriptions, digital downloads and services.
  // Claiming stock we cannot verify would be a false availability
  // representation under the ACL, and Search Console reporting a missing
  // recommended field is much the cheaper of those two problems.
  const alwaysAvailable = product.type !== 'hardware';
  const priceText = (product.priceCents / 100).toFixed(2);
  const schema = {
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    url: absoluteUrl(productPath(product)),
    ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand } } : {}),
    ...(category ? { category: category.title } : {}),
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(productPath(product)),
      priceCurrency: 'AUD',
      // Always the public RRP, never the signed-in member price: the price in
      // structured data has to match what an anonymous visitor is shown.
      price: priceText,
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: priceText,
        priceCurrency: 'AUD',
        valueAddedTaxIncluded: true,
      },
      ...(alwaysAvailable ? { availability: 'https://schema.org/InStock' } : {}),
      seller: { '@type': 'Organization', name: BUSINESS.legalName },
    },
  };

  return (
    <main id="main-content">
      <JsonLd schema={schema} />
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs
              items={[
                { name: 'Teracom Store', href: '/store' },
                ...(category ? [{ name: category.title, href: `/store/${category.slug}` }] : []),
              ]}
              current={product.name}
            />
            <span className="eyebrow">{category ? category.title : product.category}</span>
            <h1>{product.name}</h1>
            <p className="lead">{product.description}</p>

            <div className="product-buy">
              {showMemberPrice ? (
                <p className="price-rrp-struck">
                  RRP <s>{formatMoney(product.priceCents)}</s>
                </p>
              ) : null}
              <p className="price product-price">
                {showMemberPrice ? <span className="price-gst-note">Member price </span> : null}
                {!showMemberPrice && !isSubscription ? <span className="price-gst-note">RRP </span> : null}
                {formatMoney(price)}
                <span className="price-gst-note"> inc. GST{isSubscription ? ' / month' : ''}</span>
              </p>
              {/* Trade buyers quote in ex-GST, so both figures are shown. The
                  inclusive one stays the prominent figure, which is what the
                  ACL requires on a page a consumer can also land on. */}
              <p className="price-ex-gst">{formatMoney(exGstCents(price))} ex GST</p>

              {!isSignedIn && !isSubscription ? (
                <p className="form-note">
                  <Link href="/account/signup">Create a free account</Link> for additional member discounts.
                </p>
              ) : null}

              <div className="product-buy-actions">
                {isSubscription ? (
                  <CheckoutButton productId={product.id} label="Subscribe" />
                ) : (
                  <AddToCartButton productId={product.id} label="Add to Cart" />
                )}
                <Link href="/contact" className="btn btn-secondary">
                  Ask about this product
                </Link>
              </div>

              {product.type === 'hardware' ? (
                <p className="form-note product-stock-note">
                  <PackageSearch size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" />{' '}
                  Stock moves quickly &mdash; <Link href="/contact">check current availability</Link> before you book
                  the job.
                </p>
              ) : null}
            </div>
          </div>
          <StoreCategoryArt slug={artSlugForProduct(product)} />
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container product-detail-grid">
          <div>
            <h2>What you get</h2>
            <ul className="tick-list">
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Product details</h2>
            <dl className="product-spec-list">
              <div>
                <dt>Part number</dt>
                <dd>{product.sku}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>
                  {category ? <Link href={`/store/${category.slug}`}>{category.title}</Link> : product.category}
                </dd>
              </div>
              <div>
                <dt>Price</dt>
                <dd>
                  {formatMoney(product.priceCents)} inc. GST ({formatMoney(exGstCents(product.priceCents))} ex GST)
                </dd>
              </div>
              <div>
                <dt>Warranty</dt>
                <dd>
                  <Link href="/warranty">Warranty &amp; returns</Link>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section section-spacious alt">
        <div className="container">
          <ul className="product-assurances">
            {ASSURANCES.map(({ icon: Icon, text }) => (
              <li key={text}>
                <span className="tool-card-icon">
                  <Icon size={20} strokeWidth={1.8} aria-hidden="true" focusable="false" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section section-spacious">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">More from this range</span>
              <h2>Often specified alongside it.</h2>
            </div>
            <div className="feature-grid">
              {related.map((r) => (
                <Link href={productPath(r)} key={r.id}>
                  <article>
                    <h3>{r.name}</h3>
                    <p>{r.description}</p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
