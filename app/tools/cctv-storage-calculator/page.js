import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CctvStorageCalculator from '@/components/tools/CctvStorageCalculator';

export const metadata = pageMetadata({
  title: 'CCTV Storage Calculator | Teracom Solutions',
  description: 'Estimate how much recording storage a CCTV system needs from camera count, bitrate, recording hours and retention.',
  path: '/tools/cctv-storage-calculator',
});

export default function CctvStorageCalculatorPage() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <Breadcrumbs
              items={[{ name: 'Tools', href: '/tools' }]}
              current={'CCTV Storage Calculator'}
            />
            <h1>CCTV Storage Calculator</h1>
            <p className="lead">Estimate how much recording storage a CCTV system needs from camera count, bitrate, recording hours and retention.</p>
          </div>
        </div>
      </section>

      <CctvStorageCalculator />

      <section className="section section-spacious">
        <div className="container">
          <h2>How it works</h2>
          <p>The CCTV storage calculator estimates how much storage a CCTV system needs based on bitrate, recording time, number of cameras and retention period. The formula multiplies these factors together to determine the total required capacity.</p>
          <p>Need help designing a system? <Link href='/contact'>Talk to our team</Link>.</p>
        </div>
      </section>
    </main>
  );
}