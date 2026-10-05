import Link from 'next/link';
import { ArrowRight, CreditCard, Undo2, Wallet } from 'lucide-react';
import TeraPose from '@/components/TeraPose';

export default function Cancel() {
  return (
    <main id="main-content" className="cart-page">
      <section className="section">
        <div className="container cart-hero">
          <div>
            <span className="eyebrow">Checkout cancelled</span>
            <h1>No payment was taken.</h1>
            <p className="lead">Your cart is still saved -- pick up where you left off whenever you&apos;re ready.</p>
            <p className="cart-empty-cta">
              <Link className="btn btn-primary" href="/cart">
                Back to your cart <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
              </Link>{' '}
              <Link className="btn btn-secondary" href="/store">Keep shopping</Link>
            </p>
          </div>
          <div className="store-art cart-art" aria-hidden="true">
            <span className="store-art-ring tool-hero-ring"><TeraPose pose="wink" size={150} /></span>
            <span className="store-art-orbit">
              {[Undo2, CreditCard, Wallet].map((Badge, i) => (
                <span className={`store-art-badge store-art-badge-${i + 1}`} key={i}><span><Badge size={22} strokeWidth={1.8} /></span></span>
              ))}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
