'use client';

import { useMemo, useState } from 'react';
import CheckoutButton from '@/components/CheckoutButton';
import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';

import { formatMoney, productPath } from '@/lib/products';
import { unitPriceCents } from '@/lib/catalogueMerge';
import { availabilityText } from '@/lib/productDetails';

// Small tiles, like the Brands page (Robert, 2026-10-03): a photo, the
// brand, the name and the price, so a shopper can scan a category quickly.
// The full description is on the product's own page, one click away.

const GRID = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '16px' };
const TILE = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '10px',
  padding: '14px',
  border: '1px solid var(--line)',
  borderRadius: '18px',
  background: 'rgba(255,255,255,.04)',
};
const TILE_LINK = { display: 'flex', flexDirection: 'column', gap: '6px', color: 'inherit', textDecoration: 'none' };
// Supplier photos come in every shape on a white background, so each sits
// whole in the same small white box.
const PHOTO_FRAME = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '120px',
  padding: '8px',
  background: '#fff',
  borderRadius: '12px',
};
const PHOTO = { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' };
const NO_PHOTO = { color: '#555', fontWeight: 700, fontSize: '14px', textAlign: 'center' };
const BRAND = { color: 'var(--muted)', fontSize: '12px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' };
const NAME = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  fontSize: '15px',
  fontWeight: 700,
  lineHeight: 1.3,
  color: '#fff',
};
const PRICE = { margin: 0, fontSize: '17px', fontWeight: 800 };
const NOTE = { color: 'var(--muted)', fontSize: '12px', fontWeight: 400 };
// Out-of-stock products stay orderable and say when stock is expected.
const IN_STOCK = { margin: '0 0 10px', fontSize: '12px', fontWeight: 700, color: '#7ee2a8' };
const ON_ORDER = { margin: '0 0 10px', fontSize: '12px', fontWeight: 700, color: '#ffcc66' };
const MORE = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '24px' };
// A category can hold hundreds of products: show them a page at a time.
const PAGE_SIZE = 24;

export default function CategoryProductGrid({ products, isSignedIn = false, customer = null }) {
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(),
    [products]
  );
  const [activeBrand, setActiveBrand] = useState('All');
  const [shown, setShown] = useState(PAGE_SIZE);

  const matching = activeBrand === 'All' ? products : products.filter((p) => p.brand === activeBrand);
  const visible = matching.slice(0, shown);

  function chooseBrand(brand) {
    setActiveBrand(brand);
    setShown(PAGE_SIZE);
  }

  return (
    <>
      {brands.length > 1 && (
        <div className="brand-tabs" role="tablist" aria-label="Filter by brand">
          <button
            type="button"
            className={activeBrand === 'All' ? 'brand-tab active' : 'brand-tab'}
            onClick={() => chooseBrand('All')}
          >
            All
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              className={activeBrand === brand ? 'brand-tab active' : 'brand-tab'}
              onClick={() => chooseBrand(brand)}
            >
              {brand}
            </button>
          ))}
        </div>
      )}
      {!isSignedIn && (
        <p className="form-note">
          Prices shown are RRP. <a href="/account/signup">Create a free account</a> for additional member discounts.
        </p>
      )}
      <div style={GRID}>
        {visible.map((p) => {
          const isSubscription = p.type === 'subscription';
          const memberPrice = isSignedIn && !isSubscription;
          return (
            <article key={p.id} style={TILE}>
              <Link href={productPath(p)} style={TILE_LINK}>
                <span style={PHOTO_FRAME}>
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.name} loading="lazy" style={PHOTO} />
                  ) : (
                    <span style={NO_PHOTO}>{p.brand || 'Teracom'}</span>
                  )}
                </span>
                {p.brand ? <span style={BRAND}>{p.brand}</span> : null}
                <span style={NAME}>{p.name}</span>
              </Link>
              <div>
                {p.priceCents === null ? (
                  <p style={PRICE}>
                    <a href="/account/login">Sign in for pricing</a>
                  </p>
                ) : (
                  <>
                    <p style={PRICE}>
                      {formatMoney(memberPrice ? unitPriceCents(p, customer || { tier: null }) : p.priceCents)}
                      <span style={NOTE}> inc. GST{isSubscription ? ' / month' : ''}</span>
                    </p>
                    <p style={{ ...NOTE, margin: '2px 0 10px' }}>
                      {memberPrice ? (
                        <>
                          {customer?.tier ? `${customer.tier} price` : 'Member price'} · RRP <del>{formatMoney(p.priceCents)}</del>
                        </>
                      ) : isSubscription ? (
                        'Subscription'
                      ) : (
                        'RRP'
                      )}
                    </p>
                    {p.type === 'hardware' && p.stock !== null && p.stock !== undefined ? (
                      <p style={Number(p.stock) > 0 ? IN_STOCK : ON_ORDER}>{availabilityText(p.stock, p.nextDelivery)}</p>
                    ) : null}
                    {isSubscription ? (
                      <CheckoutButton productId={p.id} label="Subscribe" />
                    ) : (
                      <AddToCartButton productId={p.id} label="Add to Cart" />
                    )}
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {matching.length > shown && (
        <div style={MORE}>
          <p style={NOTE}>Showing {shown} of {matching.length}</p>
          <button type="button" className="btn btn-secondary" onClick={() => setShown((n) => n + PAGE_SIZE)}>
            Show more
          </button>
        </div>
      )}
    </>
  );
}