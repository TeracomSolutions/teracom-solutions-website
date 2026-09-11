import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/lib/cart-context';
import StructuredData from '@/components/StructuredData';

export const metadata = {
  title: 'Teracom Solutions | AI, Security & Technical Solutions',
  description: 'Teracom Solutions combines electronic security expertise with AI, technical consulting, security system design, software innovation and the Teracom AI platform.',
  metadataBase: new URL('https://www.teracomsolutions.com.au'),
  openGraph: {
    title: 'Teracom Solutions | AI, Security & Technical Solutions',
    description: 'Teracom Solutions combines electronic security expertise with AI, technical consulting, security system design, software innovation and the Teracom AI platform.',
    url: 'https://www.teracomsolutions.com.au',
    siteName: 'Teracom Solutions',
    locale: 'en_AU',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teracom Solutions | AI, Security & Technical Solutions',
    description: 'Teracom Solutions combines electronic security expertise with AI, technical consulting, security system design, software innovation and the Teracom AI platform.'
  }
};

export default function MarketingRootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StructuredData />
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
