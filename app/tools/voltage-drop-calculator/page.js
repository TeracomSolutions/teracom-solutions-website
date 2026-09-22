import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import VoltageDropCalculator from '@/components/tools/VoltageDropCalculator';

export const metadata = pageMetadata({
  title: 'Cable Voltage Drop Calculator | Teracom Solutions',
  description: 'Check the voltage drop on a 12 V or 24 V DC cable run and find the minimum conductor size for your device.',
  path: '/tools/voltage-drop-calculator',
});

export default function VoltageDropCalculatorPage() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[{ name: 'Tools', href: '/tools' }]} current={'Cable Voltage Drop Calculator'} />
            <h1>Cable Voltage Drop Calculator</h1>
            <p className="lead">Check the voltage drop on a 12 V or 24 V DC cable run and find the minimum conductor size for your device.</p>
          </div>
        </div>
      </section>

      <VoltageDropCalculator />

      <section className="section section-spacious">
        <div className="container">
          <h2>How it works</h2>
          <p>
            Current flows out to the device and back, so the calculator uses twice the one-way length. Loop resistance is
            that length times the resistivity of copper (0.0172 &Omega;&middot;mm&sup2;/m at 20&deg;C) divided by the
            conductor&apos;s cross-section; the voltage drop is the load current times that resistance. The minimum
            conductor size is the cross-section that keeps the drop inside your chosen limit.
          </p>
          <p>Need help designing a system? <Link href='/contact'>Talk to our team</Link>.</p>
        </div>
      </section>
    </main>
  );
}
