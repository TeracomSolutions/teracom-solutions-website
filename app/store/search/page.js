import Link from 'next/link';
import { cookies } from 'next/headers';

import Breadcrumbs from '@/components/Breadcrumbs';
import ProductTile, { TILE_GRID } from '@/components/ProductTile';
import StoreSearchBox from '@/components/StoreSearchBox';
import { categories, findCategory } from '@/lib/categories';
import { getAllProducts, getCustomerPricing } from '@/lib/catalogue';
import { forTiles } from '@/lib/catalogueMerge';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import { pageWindow, searchHref, searchProducts } from '@/lib/storeSearch';

export const metadata = {
  title: 'Search the Store | Teracom Solutions',
  description: 'Search the Teracom Store by product name, brand or part number, and narrow the results by category and brand.',
  // Search results are endless variations of the same products: keep them out
  // of Google's index but let it follow the links.
  robots: { index: false, follow: true },
  alternates: { canonical: '/store/search' },
};

const NOTE = { color: 'var(--muted)', fontSize: '14px' };
const FILTER_LABEL = { margin: '18px 0 8px', fontSize: '12px', fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--soft)' };
const PAGER = { display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', margin: '28px 0 0' };
const MAX_BRANDS = 30;

function text(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

// The store category slug that goes with a product category title.
function slugFor(title) {
  const category = categories.find((c) => c.productCategory === title);
  return category ? category.slug : '';
}

export default async function StoreSearchPage(props) {
  const params = await props.searchParams;
  const q = text(params?.q, 100);
  const brand = text(params?.brand, 100);
  const category = findCategory(text(params?.category, 60));
  const categoryTitle = category && category.productCategory ? category.productCategory : '';
  const categorySlug = categoryTitle ? category.slug : '';
  const page = Math.max(1, parseInt(text(params?.page, 6), 10) || 1);

  const searching = Boolean(q || brand || categoryTitle);
  const result = searching ? searchProducts(await getAllProducts(), { q, categoryTitle, brand, page }) : null;
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  const customer = await getCustomerPricing(token);

  const link = (change) => searchHref({ q, category: categorySlug, brand, page: 1, ...change });
  const heading = q ? <>Results for &ldquo;{q}&rdquo;</> : categoryTitle ? categoryTitle : 'Search the store.';

  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow tool-hero search-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[{ name: 'Teracom Store', href: '/store' }]} current="Search" />
            <span className="eyebrow">Teracom Store</span>
            <h1>{heading}</h1>
            <StoreSearchBox id="store-search-page" q={q} category={categorySlug} autoFocus={!searching} />
            {result ? (
              <p className="search-count">
                {result.total === 0
                  ? 'No products match.'
                  : `${result.total.toLocaleString('en-AU')} ${result.total === 1 ? 'product' : 'products'}${categoryTitle ? ` in ${categoryTitle}` : ''}${brand ? ` from ${brand}` : ''}.`}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          {result ? (
            <>
              {result.categories.length > 1 || categoryTitle ? (
                <>
                  <p style={FILTER_LABEL}>Category</p>
                  <div className="brand-tabs" aria-label="Filter by category">
                    <Link href={link({ category: '' })} className={categoryTitle ? 'brand-tab' : 'brand-tab active'}>All</Link>
                    {result.categories
                      .filter((c) => slugFor(c.name))
                      .map((c) => (
                        <Link
                          key={c.name}
                          href={link({ category: slugFor(c.name) })}
                          className={categoryTitle === c.name ? 'brand-tab active' : 'brand-tab'}
                        >
                          {c.name}
                          <span className="brand-tab-count">{c.count}</span>
                        </Link>
                      ))}
                  </div>
                </>
              ) : null}
              {result.brands.length > 1 || brand ? (
                <>
                  <p style={FILTER_LABEL}>Brand</p>
                  <div className="brand-tabs" aria-label="Filter by brand">
                    <Link href={link({ brand: '' })} className={brand ? 'brand-tab' : 'brand-tab active'}>All</Link>
                    {result.brands.slice(0, MAX_BRANDS).map((b) => (
                      <Link key={b.name} href={link({ brand: b.name })} className={brand === b.name ? 'brand-tab active' : 'brand-tab'}>
                        {b.name}
                        <span className="brand-tab-count">{b.count}</span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : null}
              {!token && result.total > 0 ? (
                <p className="form-note">
                  Prices shown are RRP. <a href="/account/signup">Create a free account</a> for additional member discounts.
                </p>
              ) : null}
              {result.items.length > 0 ? (
                <div style={TILE_GRID}>
                  {forTiles(result.items).map((p) => (
                    <ProductTile key={p.id} p={p} isSignedIn={Boolean(token)} customer={customer} />
                  ))}
                </div>
              ) : (
                <div className="search-empty">
                  <h2>Nothing matched that search.</h2>
                  <p>
                    Try fewer or different words, a part number, or take off a filter. If it is not listed yet, tell us the
                    spec or part number and we will come back with current stock and a price, usually the same day.
                  </p>
                  <div className="service-jump search-popular">
                    {brand || categoryTitle ? <Link href={searchHref({ q })}>Search everything for &ldquo;{q}&rdquo;</Link> : null}
                    <Link href="/contact?interest=Teracom Store">Request a quote</Link>
                  </div>
                </div>
              )}
              {result.pages > 1 ? (
                <nav style={PAGER} aria-label="Pages of results">
                  {result.page > 1 ? (
                    <Link className="brand-tab" href={link({ page: result.page - 1 })}>Previous</Link>
                  ) : null}
                  {pageWindow(result.page, result.pages).map((n, i) =>
                    n === '…' ? (
                      <span key={`gap-${i}`} style={NOTE}>…</span>
                    ) : (
                      <Link
                        key={n}
                        href={link({ page: n })}
                        className={n === result.page ? 'brand-tab active' : 'brand-tab'}
                        aria-current={n === result.page ? 'page' : undefined}
                      >
                        {n}
                      </Link>
                    )
                  )}
                  {result.page < result.pages ? (
                    <Link className="brand-tab" href={link({ page: result.page + 1 })}>Next</Link>
                  ) : null}
                </nav>
              ) : null}
            </>
          ) : (
            <div className="search-empty">
              <h2>What are you looking for?</h2>
              <p>Search by product name, brand or part number, or start with a category.</p>
              <div className="service-jump search-popular">
                {categories
                  .filter((c) => !c.isDynamic)
                  .map((c) => (
                    <Link key={c.slug} href={searchHref({ category: c.slug })}>{c.title}</Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}