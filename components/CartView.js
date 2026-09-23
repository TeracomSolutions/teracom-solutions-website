'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  BellRing,
  CreditCard,
  FileText,
  KeyRound,
  Lock,
  Minus,
  Package,
  PackageCheck,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Trash2,
  Truck,
  Wrench,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatMoney, memberPriceCents } from '@/lib/products';
import StripeTrustBadge from '@/components/StripeTrustBadge';

const CATEGORY_ICONS = {
  'Access Control': KeyRound,
  Intrusion: BellRing,
  Software: Sparkles,
  Digital: FileText,
  Services: Wrench,
};

const STEPS = ['Cart', 'Sign in', 'Secure payment', 'Confirmation'];

const POPULAR = [
  { label: 'Access control', href: '/store/access-control' },
  { label: 'Intrusion', href: '/store/intrusion' },
  { label: 'CCTV', href: '/store/cctv' },
  { label: 'Networking', href: '/store/networking' },
  { label: 'Teracom AI plans', href: '/store' },
];

function CartArt() {
  return (
    <div className="store-art cart-art" aria-hidden="true">
      <span className="store-art-ring tool-hero-ring">
        <ShoppingCart size={88} strokeWidth={1.3} focusable="false" />
      </span>
      <span className="store-art-orbit">
        {[CreditCard, ShieldCheck, Truck].map((Badge, i) => (
          <span className={`store-art-badge store-art-badge-${i + 1}`} key={i}>
            <span>
              <Badge size={22} strokeWidth={1.8} focusable="false" />
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}

function Progress({ current }) {
  return (
    <ol className="cart-progress" aria-label="Checkout steps">
      {STEPS.map((step, i) => (
        <li key={step} className={i < current ? 'done' : i === current ? 'current' : undefined} aria-current={i === current ? 'step' : undefined}>
          <span>{i + 1}</span>
          {step}
        </li>
      ))}
    </ol>
  );
}

export default function CartView({ isMember = false, shippingCents = 1500 }) {
  const { lines, totalItems, totalCents: rrpTotalCents, updateQuantity, removeItem } = useCart();
  // Signed-in customers see the member price they'll actually be charged at
  // checkout; everyone else sees RRP (the cookie is only a display hint --
  // /api/checkout/cart verifies the session before charging).
  const unitCents = (product) => (isMember ? memberPriceCents(product) : product.priceCents);
  const subtotalCents = lines.reduce((sum, l) => sum + l.quantity * unitCents(l.product), 0);
  const savingsCents = isMember ? rrpTotalCents - subtotalCents : 0;
  const needsShipping = lines.some((l) => l.product.type === 'hardware');
  const totalCents = subtotalCents + (needsShipping ? shippingCents : 0);
  const gstCents = Math.round(totalCents / 11);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckout() {
    setError('');
    setLoading(true);
    // The Stripe session is created by the checkout page itself now, so
    // this is a plain navigation. begin_checkout fires there, once, rather
    // than here and again on arrival.
    window.location.href = '/checkout';
  }

  if (lines.length === 0) {
    return (
      <main id="main-content" className="cart-page">
        <section className="section">
          <div className="container cart-hero">
            <div>
              <span className="eyebrow">Your cart</span>
              <h1>Your cart is empty.</h1>
              <p className="lead">Browse the store and add some products -- your cart is saved on this device.</p>
              <div className="service-jump cart-popular">
                {POPULAR.map((p) => (
                  <Link key={p.label} href={p.href}>{p.label}</Link>
                ))}
              </div>
              <p className="cart-empty-cta">
                <Link className="btn btn-primary" href="/store">
                  Browse the store <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                </Link>
              </p>
            </div>
            <CartArt />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="cart-page">
      <section className="section">
        <div className="container">
          <div className="cart-hero">
            <div>
              <span className="eyebrow">Your cart</span>
              <h1>Review your order.</h1>
              <Progress current={isMember ? 2 : 1} />
            </div>
            <CartArt />
          </div>

          <div className="cart-layout">
            <div>
              <ul className="cart-lines">
                {lines.map((l) => {
                  const Icon = CATEGORY_ICONS[l.product.category] || Package;
                  return (
                    <li className="cart-line" key={l.productId}>
                      <span className="tool-card-icon cart-line-icon">
                        <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <div className="cart-line-info">
                        <h3>{l.product.name}</h3>
                        <p className="muted">
                          {l.product.category}
                          {' · '}
                          {isMember ? (
                            <>
                              {formatMoney(unitCents(l.product))} each <s>{formatMoney(l.product.priceCents)}</s>
                            </>
                          ) : (
                            <>{formatMoney(l.product.priceCents)} each</>
                          )}
                        </p>
                      </div>
                      <div className="cart-qty-control">
                        <button type="button" onClick={() => updateQuantity(l.productId, l.quantity - 1)} aria-label={`Decrease quantity of ${l.product.name}`}>
                          <Minus size={14} strokeWidth={2.4} aria-hidden="true" />
                        </button>
                        <span aria-live="polite">{l.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(l.productId, l.quantity + 1)} aria-label={`Increase quantity of ${l.product.name}`}>
                          <Plus size={14} strokeWidth={2.4} aria-hidden="true" />
                        </button>
                      </div>
                      <p className="cart-line-total">{formatMoney(unitCents(l.product) * l.quantity)}</p>
                      <button type="button" className="cart-remove" onClick={() => removeItem(l.productId)} aria-label={`Remove ${l.product.name}`}>
                        <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Link className="cart-continue" href="/store">
                <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" /> Continue shopping
              </Link>
              <StripeTrustBadge />
            </div>

            <aside className="cart-summary-card" aria-label="Order summary">
              <h2>Order summary</h2>
              <dl>
                <div>
                  <dt>Items ({totalItems})</dt>
                  <dd>{formatMoney(isMember ? rrpTotalCents : subtotalCents)}</dd>
                </div>
                {savingsCents > 0 ? (
                  <div className="cart-savings">
                    <dt>Member savings</dt>
                    <dd>−{formatMoney(savingsCents)}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Shipping</dt>
                  <dd>{needsShipping ? `${formatMoney(shippingCents)} flat rate` : 'Not required'}</dd>
                </div>
                <div className="cart-summary-total">
                  <dt>Total</dt>
                  <dd>{formatMoney(totalCents)}</dd>
                </div>
              </dl>
              <p className="cart-gst">Includes GST of {formatMoney(gstCents)}. Prices in AUD.</p>

              {!isMember ? (
                <div className="cart-member-note">
                  <BadgePercent size={20} strokeWidth={1.8} aria-hidden="true" />
                  <p>Sign in to check out. Account holders get member pricing on store items.</p>
                </div>
              ) : null}

              {error && <p className="form-error" role="alert">{error}</p>}

              {isMember ? (
                <button type="button" className="btn btn-primary cart-checkout" onClick={handleCheckout} disabled={loading}>
                  <Lock size={17} strokeWidth={2} aria-hidden="true" />
                  {loading ? 'Opening secure checkout…' : 'Secure checkout'}
                </button>
              ) : (
                <>
                  <Link className="btn btn-primary cart-checkout" href="/account/login?next=/cart">
                    <Lock size={17} strokeWidth={2} aria-hidden="true" /> Sign in to check out
                  </Link>
                  <Link className="btn btn-secondary cart-checkout" href="/account/signup?next=/cart">
                    Create a free account
                  </Link>
                </>
              )}

              <p className="cart-promo">Have a promo code? Enter it on the secure payment page.</p>

              <ul className="cart-assurances">
                <li><ShieldCheck size={17} strokeWidth={1.8} aria-hidden="true" /> Secure payment by Stripe</li>
                <li><PackageCheck size={17} strokeWidth={1.8} aria-hidden="true" /> Australian owned and operated</li>
                <li>
                  <RotateCcw size={17} strokeWidth={1.8} aria-hidden="true" />{' '}
                  <Link href="/warranty">Warranty &amp; returns</Link>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
