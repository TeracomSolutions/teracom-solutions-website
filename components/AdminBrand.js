import Image from 'next/image';
import Link from 'next/link';

// The console's own top bar: the logo, its name, and the one way back to
// the public site (in a new tab, so the console stays where it is).
export default function AdminBrand({ signedIn = true }) {
  return (
    <div className="admin-brand">
      <Link href={signedIn ? '/admin' : '/admin/login'} className="admin-brand-logo" aria-label="Teracom Administration Console">
        <Image src="/assets/teracom-logo.png" alt="Teracom Solutions" width={150} height={58} priority />
      </Link>
      <span className="admin-brand-title">Administration Console</span>
      <a href="/" target="_blank" rel="noopener noreferrer" className="admin-brand-link">
        View website ↗
      </a>
    </div>
  );
}
