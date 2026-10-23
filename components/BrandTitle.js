'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { BRAND, retitle } from '@/lib/brand';

// On a copy of the console for another business, page titles written for Teracom
// ("Pricing|Teracom Solutions") show that business's name in the browser tab instead.
export default function BrandTitle() {
  const pathname = usePathname();
  useEffect(() => {
    if (!BRAND.custom) return undefined;
    const fix = () => {
      const next = retitle(document.title, BRAND);
      if (next !== document.title) document.title = next;
    };
    fix();
    const timer = setTimeout(fix, 300);
    return () => clearTimeout(timer);
  }, [pathname]);
  return null;
}
