import { CreditCard } from 'lucide-react';

import CheckoutEmbed from '@/components/CheckoutEmbed';
import { pageMetadata, NOINDEX } from '@/lib/seo';

export const metadata = {
  ...pageMetadata({
    title: 'Checkout | Teracom Solutions',
    description: 'Complete your Teracom Store order.',
    path: '/checkout',
  }),
  // A checkout page has no business in search results.
  ...NOINDEX,
};

export default function CheckoutPage() {
  return (
    <main id="main-content" className="cart-page">
      <section className="section">
        <div className="container checkout-container">
          <span className="eyebrow">Checkout</span>
          <h1>Secure payment.</h1>
          <ol className="cart-progress" aria-label="Checkout steps">
            <li className="done">
              <span>1</span>Cart
            </li>
            <li className="done">
              <span>2</span>Sign in
            </li>
            <li className="current" aria-current="step">
              <span>3</span>Secure payment
            </li>
            <li>
              <span>4</span>Confirmation
            </li>
          </ol>
          <p className="form-note checkout-assurance">
            <CreditCard size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" /> Payment is processed by
            Stripe. Card details never touch our servers, and there is no card surcharge.
          </p>

          <CheckoutEmbed />
        </div>
      </section>
    </main>
  );
}
