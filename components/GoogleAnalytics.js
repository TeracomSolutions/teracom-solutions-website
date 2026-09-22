import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';

// Loads gtag.js after the page is interactive, so it never delays rendering.
// GA4's enhanced measurement records client-side route changes from browser
// history events, so App Router navigations count as page views without any
// extra wiring here.
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
