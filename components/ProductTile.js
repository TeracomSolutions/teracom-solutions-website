'use client';

import Link from 'next/link';

import AddToCartButton from '@/components/AddToCartButton';
import CheckoutButton from '@/components/CheckoutButton';
import { formatMoney, productPath } from '@/lib/products';
import { unitPriceCents } from '@/lib/catalogueMerge';
import { availabilityText } from '@/lib/productDetails';

// One small tile, like the Brands page (Robert, 2026-10-03): a photo, the
// brand, the name and the price, so a shopper can scan a category quickly.
// The full description is on the product's own page, one click away. The
// category pages and the store search results both use it.

export const TILE_GRID = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '16px' };
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

export default function ProductTile({ p, isSignedIn = false, customer = null }) {
  const isSubscription = p.type === 'subscription';
  const memberPrice = isSignedIn && !isSubscription;
  return (
    <article style={TILE}>
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
}