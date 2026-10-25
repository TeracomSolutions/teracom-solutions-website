import Image from 'next/image';
import Link from 'next/link';

import { BRAND } from '@/lib/brand';

// The console's own top bar: the logo, its name, and the one way back to
// the public site (in a new tab, so the console stays where it is).
// part="logo" is only the logo, at the top of the menu on the left; part="bar" is the bar
// without it, above the page (Robert, 2026-10-25: the menu sits under the logo).
export default function AdminBrand({ signedIn = true, part = 'all' }) {
  const logo = (
    <Link href={signedIn ? '/admin' : '/admin/login'} className="admin-brand-logo" aria-label={`${BRAND.name} Administration Console`}>
        {BRAND.logo ? (
          <Image src={BRAND.logo} alt={BRAND.name} width={150} height={58} priority />
        ) : (
          <span className="admin-brand-name">{BRAND.name}</span>
        )}
    </Link>
  );
  if (part === 'logo') return <div className="admin-sidebar-logo">{logo}</div>;
  return (
    <div className={part === 'bar' ? 'admin-brand admin-brand-bar' : 'admin-brand'}>
      {part !== 'bar' && logo}
      <span className="admin-brand-title">Administration Console</span>
      {signedIn && <Link href="/admin/where" className="admin-brand-link admin-brand-help">Where to find</Link>}
      {signedIn && <Link href="/admin/guide" className="admin-brand-link">Help</Link>}
      <a href={BRAND.siteUrl} target="_blank" rel="noopener noreferrer" className={signedIn ? 'admin-brand-link' : 'admin-brand-link admin-brand-help'}>
        View website ↗
      </a>
    </div>
  );
}
