import Link from 'next/link';
import { ArrowRight, Mail, PackageCheck, ShieldCheck, TriangleAlert, Truck } from 'lucide-react';

import ClearCartOnMount from '@/components/ClearCartOnMount';
import PurchaseTracked from '@/components/PurchaseTracked';
import { stripe } from '@/lib/stripe';
import { pageMetadata, NOINDEX } from '@/lib/seo';

export const metadata = {
  ...pageMetadata({
    title: 'Order complete | Teracom Solutions',
    description: 'Your Teracom Store order.',
    path: '/checkout/complete',
  }),
  ...NOINDEX,
};

// Where Stripe returns the customer after an embedded checkout.
//
// The session is retrieved server-side and its status checked before
// anything is claimed. A bookmarked or shared URL, or a payment that never
// completed, must not produce a thank-you page -- and must not report a
// purchase to analytics either.

export default async function CheckoutCompletePage(props) {
  const searchParams = await props.searchParams;
  const sessionId = typeof searchParams?.session_id === 'string' ? searchParams.session_id : '';

  let session = null;
  if (sessionId) {
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
    } catch (error) {
      // Bad id, wrong account, or Stripe unreachable. Handled below as
      // "we cannot confirm this", never as success.
      console.error('Could not retrieve checkout session', error instanceof Error ? error.message : error);
    }
  }

  const paid = session?.status === 'complete' && session?.payment_status === 'paid';

  if (!paid) {
    return (
      <main id="main-content" className="cart-page">
        <section className="section">
          <div className="container checkout-container">
            <span className="eyebrow">Checkout</span>
            <h1>We couldn&apos;t confirm that payment.</h1>
            <p className="lead">
              {session
                ? 'Your payment was not completed, so nothing has been charged and your cart is still here.'
                : 'We could not find that order. If you have been charged, nothing is lost -- call us and we will sort it out.'}
            </p>
            <p className="cart-empty-cta">
              <Link className="btn btn-primary" href="/cart">
                Back to your cart <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
              </Link>{' '}
              <a className="btn btn-secondary" href="tel:+61397082685">
                Call +61 3 9708 2685
              </a>
            </p>
            <p className="form-note checkout-assurance">
              <TriangleAlert size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" /> Nothing on this page
              means a payment failed permanently &mdash; it means we cannot confirm one from here.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const items = (session.line_items?.data || []).map((line) => ({
    item_name: line.description,
    quantity: line.quantity,
    price: line.amount_total != null && line.quantity ? Number((line.amount_total / line.quantity / 100).toFixed(2)) : undefined,
  }));

  return (
    <main id="main-content" className="cart-page">
      <ClearCartOnMount />
      {/* Keyed on the payment intent, not the session: it maps one-to-one to
          the money and to any later refund, and it survives a refresh. */}
      <PurchaseTracked
        transactionId={
          typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || session.id
        }
        value={session.amount_total != null ? Number((session.amount_total / 100).toFixed(2)) : undefined}
        shipping={
          session.shipping_cost?.amount_total != null
            ? Number((session.shipping_cost.amount_total / 100).toFixed(2))
            : undefined
        }
        items={items}
      />
      <section className="section">
        <div className="container cart-hero">
          <div>
            <span className="eyebrow">Payment successful</span>
            <h1>Thank you for your order.</h1>
            <p className="lead">
              Your payment has been received. A confirmation is on its way to{' '}
              {session.customer_details?.email || 'your email address'}.
            </p>
            <ol className="cart-progress" aria-label="Checkout steps">
              <li className="done">
                <span>1</span>Cart
              </li>
              <li className="done">
                <span>2</span>Sign in
              </li>
              <li className="done">
                <span>3</span>Secure payment
              </li>
              <li className="current" aria-current="step">
                <span>4</span>Confirmation
              </li>
            </ol>
            <p className="cart-empty-cta">
              <Link className="btn btn-primary" href="/store">
                Back to the store <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
              </Link>{' '}
              <Link className="btn btn-secondary" href="/account">
                Your account
              </Link>
            </p>
          </div>
          <div className="store-art cart-art" aria-hidden="true">
            <span className="store-art-ring tool-hero-ring">
              <PackageCheck size={88} strokeWidth={1.3} />
            </span>
            <span className="store-art-orbit">
              {[Mail, Truck, ShieldCheck].map((Badge, i) => (
                <span className={`store-art-badge store-art-badge-${i + 1}`} key={i}>
                  <span>
                    <Badge size={22} strokeWidth={1.8} />
                  </span>
                </span>
              ))}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
