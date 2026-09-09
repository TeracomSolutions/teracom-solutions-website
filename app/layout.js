import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/lib/cart-context';

export const metadata = {
  title: 'Teracom Solutions | AI, Security & Technical Solutions',
  description: 'Teracom Solutions combines electronic security expertise with AI, technical consulting, security system design, software innovation and the Teracom AI platform.',
};

export default function MarketingRootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
