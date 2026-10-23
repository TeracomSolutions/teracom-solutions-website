import Image from 'next/image';
import Link from 'next/link';

import { BRAND } from '@/lib/brand';

// The console's own top bar: the logo, its name, and the one way back to
// the public site (in a new tab, so the console stays where it is).
export default function AdminBrand({ signedIn = true }) {
  return (
    <div className="admin-brand">
      <Link href={signedIn ? '/admin' : '/admin/login'} className="admin-brand-logo" aria-label={`${BRAND.name} Administration Console`}>
        {BRAND.logo ? (
          <Image src={BRAND.logo} alt={BRAND.name} width={150} height={58} priority />
        ) : (
          <span className="admin-brand-name">{BRAND.name}</span>
        )}
      </Link>
      <span className="admin-brand-title">Administration Console</span>
      {signedIn && <Link href="/admin/where" className="admin-brand-link admin-brand-help">Where to find</Link>}
      {signedIn && <Link href="/admin/guide" className="admin-brand-link">Help</Link>}
      <a href={BRAND.siteUrl} target="_blank" rel="noopener noreferrer" className={signedIn ? 'admin-brand-link' : 'admin-brand-link admin-brand-help'}>
        View website ↗
      </a>
    </div>
  );
}
