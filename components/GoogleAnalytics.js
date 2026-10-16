'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';
import { isAdminPath } from '@/lib/adminIndexing';

// Staff pages are not counted (Robert, 2026-10-12)
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const admin = isAdminPath(pathname || '');

  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      window['ga-disable-' + GA_MEASUREMENT_ID] = admin;
    }
  }, [admin]);

  if (!GA_MEASUREMENT_ID || admin) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());var u=new URL(location.href);['token','session_id','t','c'].forEach(function(k){u.searchParams.delete(k);});gtag('config','${GA_MEASUREMENT_ID}',{page_location:u.toString()});`}
      </Script>
    </>
  );
}