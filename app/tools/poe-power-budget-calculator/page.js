import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import PoeBudgetCalculator from '@/components/tools/PoeBudgetCalculator';

export const metadata = pageMetadata({
  title: 'PoE Power Budget Calculator | Teracom Solutions',
  description: 'Add up the PoE power your cameras, access points and devices draw, and check it against your switch budget.',
  path: '/tools/poe-power-budget-calculator',
});

export default function PoeBudgetCalculatorPage() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <Breadcrumbs
              items={[{ name: 'Tools', href: '/tools' }]}
              current={'PoE Power Budget Calculator'}
            />
            <h1>PoE Power Budget Calculator</h1>
            <p className="lead">Add up the PoE power your cameras, access points and devices draw, and check it against your switch budget.</p>
          </div>
        </div>
      </section>

      <PoeBudgetCalculator />

      <section className="section section-spacious">
        <div className="container">
          <h2>How it works</h2>
          <p>The PoE power budget calculator sums up the power consumption of all devices connected to a switch, multiplied by their quantity, and compares this against the switch&apos;s PoE budget.</p>
          <p>Need help designing a system? <Link href='/contact'>Talk to our team</Link>.</p>
        </div>
      </section>
    </main>
  );
}