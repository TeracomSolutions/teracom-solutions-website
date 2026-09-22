import Link from 'next/link';
import { Compass, LifeBuoy, MapPinOff, Search, ShoppingBag, Wrench } from 'lucide-react';

const POPULAR = [
  { label: 'What we do', href: '/services' },
  { label: 'Teracom Store', href: '/store' },
  { label: 'Free tools', href: '/tools' },
  { label: 'Brands', href: '/brands' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
];

export default function NotFound() {
  return (
    <main id="main-content" className="cart-page">
      <section className="section">
        <div className="container cart-hero">
          <div>
            <span className="eyebrow">404 error</span>
            <h1>We can&apos;t find that page.</h1>
            <p className="lead">
              It may have moved, or the address might have a typo. Search the site, or start from one of these.
            </p>
            <form className="search-form not-found-search" action="/search" role="search">
              <Search size={22} strokeWidth={2} aria-hidden="true" />
              <label htmlFor="not-found-search" className="visually-hidden">Search Teracom Solutions</label>
              <input id="not-found-search" type="search" name="q" placeholder="Products, services, brands, tools…" autoComplete="off" />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
            <div className="service-jump cart-popular">
              {POPULAR.map((p) => (
                <Link key={p.href} href={p.href}>{p.label}</Link>
              ))}
            </div>
          </div>
          <div className="store-art cart-art" aria-hidden="true">
            <span className="store-art-ring tool-hero-ring">
              <MapPinOff size={88} strokeWidth={1.3} />
            </span>
            <span className="store-art-orbit">
              {[Compass, ShoppingBag, Wrench].map((Badge, i) => (
                <span className={`store-art-badge store-art-badge-${i + 1}`} key={i}>
                  <span><Badge size={22} strokeWidth={1.8} /></span>
                </span>
              ))}
            </span>
          </div>
        </div>
        <div className="container">
          <p className="form-note not-found-help">
            <LifeBuoy size={16} strokeWidth={1.8} aria-hidden="true" /> Still stuck?{' '}
            <Link href="/contact">Contact us</Link> and we&apos;ll point you in the right direction.
          </p>
        </div>
      </section>
    </main>
  );
}
