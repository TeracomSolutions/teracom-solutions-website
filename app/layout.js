import { Inter } from 'next/font/google';

import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PublicChrome from '@/components/PublicChrome';
import { CartProvider } from '@/lib/cart-context';
import AskTeraWidget from '@/components/AskTeraWidget';
import StructuredData from '@/components/StructuredData';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import AnalyticsEvents from '@/components/AnalyticsEvents';
import VisitBeacon from '@/components/VisitBeacon';
import { GOOGLE_SITE_VERIFICATION } from '@/lib/analytics';
import { SITE_ORIGIN } from '@/lib/seo';

// globals.css has always asked for `font-family: Inter, ...` but Inter was
// never actually loaded -- no next/font, no @font-face, no stylesheet link --
// so every visitor without Inter installed locally silently got the
// system-ui fallback. Loading it through next/font self-hosts the file,
// preloads it, and attaches a `font-display: swap` fallback with matching
// metrics, which means the intended typeface renders without adding a
// render-blocking request or a layout shift (CLS) when it arrives.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const DEFAULT_TITLE = 'Teracom Solutions | Technology, Security & AI Solutions Australia';
const DEFAULT_DESCRIPTION =
  'Australian-owned technology specialists. Security systems, audio visual, electrical, automation, networking, software and systems integration, technical consulting, and the Teracom AI platform. Melbourne and Sydney.';

export const metadata = {
  // Deliberately NOT a title.template. Several pages already ship their own
  // fully-branded titles (e.g. 'About Us | Teracom Solutions'), and a template
  // would append the brand a second time. Each page owns its complete title
  // instead, which also keeps it inside the ~60-character budget Google
  // renders before truncating.
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: 'Teracom Solutions',
  alternates: { canonical: '/' },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_ORIGIN,
    siteName: 'Teracom Solutions',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  ...(GOOGLE_SITE_VERIFICATION ? { verification: { google: GOOGLE_SITE_VERIFICATION } } : {}),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Allows full-length text snippets, large image previews and full video
      // previews in search results rather than Google's conservative
      // defaults. More surface area in the SERP means a higher click-through
      // rate for the same ranking position.
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

export default function MarketingRootLayout({ children }) {
  return (
    // en-AU rather than plain en: it is the accurate regional signal for an
    // Australian business and it matches the og:locale already declared above.
    <html lang="en-AU" className={inter.variable}>
      <body>
        <StructuredData />
        <GoogleAnalytics />
        <AnalyticsEvents />
        <VisitBeacon />
        {/* Keyboard and screen-reader users otherwise have to tab through the
            entire header nav, the resources dropdown and the cart on every
            single page before reaching content (WCAG 2.4.1 Bypass Blocks).
            Visually hidden until focused. */}
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <CartProvider>
          <PublicChrome><Header /></PublicChrome>
          {children}
          <PublicChrome><Footer /></PublicChrome>
          {/* Ask Tera chat: hidden until its backend is connected -- the stub route only ever
              replies "not connected yet", which reads as broken on every page.
              Set NEXT_PUBLIC_ASK_TERA_ENABLED=true in Vercel to switch it on. */}
          {process.env.NEXT_PUBLIC_ASK_TERA_ENABLED === 'true' && <AskTeraWidget />}
        </CartProvider>
      </body>
    </html>
  );
}
