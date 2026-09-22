import Link from 'next/link';
import { ArrowRight, Mail, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import ClearCartOnMount from '@/components/ClearCartOnMount';

export default function Success() {
  return (
    <main id="main-content" className="cart-page">
      <ClearCartOnMount />
      <section className="section">
        <div className="container cart-hero">
          <div>
            <span className="eyebrow">Payment successful</span>
            <h1>Thank you for your order.</h1>
            <p className="lead">Your payment has been received. A confirmation will be sent to your email shortly.</p>
            <ol className="cart-progress" aria-label="Checkout steps">
              <li className="done"><span>1</span>Cart</li>
              <li className="done"><span>2</span>Sign in</li>
              <li className="done"><span>3</span>Secure payment</li>
              <li className="current" aria-current="step"><span>4</span>Confirmation</li>
            </ol>
            <p className="cart-empty-cta">
              <Link className="btn btn-primary" href="/store">
                Back to the store <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
              </Link>{' '}
              <Link className="btn btn-secondary" href="/account">Your account</Link>
            </p>
          </div>
          <div className="store-art cart-art" aria-hidden="true">
            <span className="store-art-ring tool-hero-ring"><PackageCheck size={88} strokeWidth={1.3} /></span>
            <span className="store-art-orbit">
              {[Mail, Truck, ShieldCheck].map((Badge, i) => (
                <span className={`store-art-badge store-art-badge-${i + 1}`} key={i}><span><Badge size={22} strokeWidth={1.8} /></span></span>
              ))}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
