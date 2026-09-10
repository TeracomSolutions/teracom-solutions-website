'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { resourcesSections } from '@/lib/resourcesSections';

export default function ResourcesSubNav() {
  const pathname = usePathname();

  return (
    <div className="brand-tabs resources-subnav" role="tablist" aria-label="Resources sections">
      {resourcesSections.map((s) => {
        const href = `/resources/${s.slug}`;
        const active = pathname === href;
        return (
          <Link key={s.slug} href={href} className={active ? 'brand-tab active' : 'brand-tab'}>
            {s.title}
          </Link>
        );
      })}
    </div>
  );
}
