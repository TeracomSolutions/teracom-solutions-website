import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import BatteryStandbyCalculator from '@/components/tools/BatteryStandbyCalculator';

export const metadata = pageMetadata({
  title: 'Battery Standby Calculator | Teracom Solutions',
  description: 'Work out the battery capacity an alarm or access control panel needs to cover its standby and alarm load.',
  path: '/tools/battery-standby-calculator',
});

export default function BatteryStandbyCalculatorPage() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <Breadcrumbs
              items={[{ name: 'Tools', href: '/tools' }]}
              current={'Battery Standby Calculator'}
            />
            <h1>Battery Standby Calculator</h1>
            <p className="lead">Work out the battery capacity an alarm or access control panel needs to cover its standby and alarm load.</p>
          </div>
        </div>
      </section>

      <BatteryStandbyCalculator />

      <section className="section section-spacious">
        <div className="container">
          <h2>How it works</h2>
          <p>The battery standby calculator determines the required battery capacity by multiplying the standby and alarm currents by their respective durations, then applying a derating factor to account for battery ageing and temperature.</p>
          <p>Need help designing a system? <Link href='/contact'>Talk to our team</Link>.</p>
        </div>
      </section>
    </main>
  );
}