import Link from 'next/link';
import { Bot, Puzzle } from 'lucide-react';

import { fetchDepartmentCatalogue } from '@/lib/api/departmentCatalogue';
import { KIND_LABELS, groupCatalogue } from '@/lib/departmentCatalogue';
import { publishedPrices } from '@/lib/departmentPrices';
import { BASE_PLATFORM_MONTHLY, GST_RATE, money, monthlyMoney } from '@/lib/savings';
import { pageMetadata } from '@/lib/seo';
import { INDUSTRY_NOTE } from '@/components/CatalogueDepartments';

// Store > Teracom AI (Robert, 2026-11-03): Teracom's own software in its own section
// of the store, so it is easy to find. Every Department and extension pack comes from
// Global's live catalogue (lib/departmentCatalogue.js); each opens its own page with
// everything it includes, and its published price with the base platform (4 November 2026).
export const teracomAiStoreMetadata = pageMetadata({
  title: 'Teracom AI Departments and Extension Packs | Teracom Store',
  description: 'Teracom AI software in the Teracom Store: every Department and extension pack, what each one does, its digital workers, dashboards and reports, and which plans include it.',
  path: '/store/teracom-ai',
});

export const interestLink = (name) => `/?interest=${encodeURIComponent(`Teracom AI ${name}`)}#contact`;

function PackCard({ pack, label, price }) {
  return (
    <article className="product-card ai-pack-card">
      <div>
        <span className="badge">{label}</span>
        <h3><Link href={`/store/teracom-ai/${pack.slug}`}>{pack.name}</Link></h3>
        {pack.description ? <p>{pack.description}</p> : null}
        <p className="ai-pack-meta">
          {[pack.includes.length ? `${pack.includes.length} screens, dashboards and reports` : '', pack.tiers.length ? `Included in ${pack.tiers.join(', ')}` : '']
            .filter(Boolean)
            .join(' · ')}
        </p>
        {pack.extensions?.length ? <p className="ai-pack-meta">Extension packs: {pack.extensions.map((e) => e.name).join(', ')}</p> : null}
      </div>
      <div>
        <p className="price">{price ? `${monthlyMoney((price + BASE_PLATFORM_MONTHLY) * (1 + GST_RATE))} a month incl. GST` : 'Pricing coming soon'}</p>
        {price ? <p className="ai-pack-meta">{money(price)} plus the {money(BASE_PLATFORM_MONTHLY)} base platform every customer has, ex GST</p> : null}
        <div className="ai-pack-actions">
          <Link className="btn btn-secondary" href={`/store/teracom-ai/${pack.slug}`}>See what&apos;s included</Link>
          <Link className="btn btn-primary" href={interestLink(pack.name)}>Register interest</Link>
        </div>
      </div>
    </article>
  );
}

export default async function TeracomAiStoreView() {
  const { entries } = await fetchDepartmentCatalogue();
  const { departments, sections } = groupCatalogue(entries);
  const extensionCount = entries.length - departments.length;
  const prices = publishedPrices();
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow store-hero">
        <div className="container">
          <div className="hero-copy">
            <span className="eyebrow">Teracom Store · Teracom AI</span>
            <h1>Teracom AI Departments and extension packs.</h1>
            <p className="lead">
              Deploy a Department, or build an entire AI organisation. Each Department brings its own digital workers,
              dashboards and reports, working from one organisational memory and under your approval. Open any one to see
              exactly what it includes, what each worker does and what always stays with a person.
            </p>
            <p className="store-gst">
              Teracom AI Departments are in early access: register your interest to take part. {departments.length} Departments and{' '}
              {extensionCount} extension pack{extensionCount === 1 ? '' : 's'}.{' '}
              <Link href="/teracom-ai" style={{ color: 'inherit', textDecoration: 'underline' }}>How Teracom AI works</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          <div className="section-heading left">
            <span className="eyebrow"><Bot size={16} aria-hidden="true" /> Departments</span>
            <h2>Departments</h2>
          </div>
          <div className="product-grid">
            {departments.map((d) => <PackCard key={d.slug} pack={d} label="Department" price={prices?.[d.slug]} />)}
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <section className="section section-spacious alt" key={section.title}>
          <div className="container">
            <div className="section-heading left">
              <span className="eyebrow"><Puzzle size={16} aria-hidden="true" /> {section.title}</span>
              <h2>{section.title}</h2>
              {/industry/i.test(section.title) ? <p>{INDUSTRY_NOTE}</p> : null}
            </div>
            <div className="product-grid">
              {section.packs.map((p) => <PackCard key={p.slug} pack={p} label={KIND_LABELS[p.kind] || 'Extension pack'} price={prices?.[p.slug]} />)}
            </div>
          </div>
        </section>
      ))}

      {departments.some((d) => d.extensions.length) ? (
        <section className="section section-spacious alt">
          <div className="container">
            <div className="section-heading left">
              <span className="eyebrow"><Puzzle size={16} aria-hidden="true" /> Extension packs</span>
              <h2>Department extension packs</h2>
            </div>
            <div className="product-grid">
              {departments.flatMap((d) => d.extensions.map((e) => <PackCard key={e.slug} pack={e} label={`${d.name} extension`} price={prices?.[e.slug]} />))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <p>
            Looking for Teracom AI subscriptions? They are on the <Link href="/store#subscriptions">Teracom Store</Link> front page.
            Questions about which Department fits your organisation? <Link href="/?interest=Teracom%20AI#contact">Talk to us</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
