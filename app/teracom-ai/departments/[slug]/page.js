import Link from 'next/link';
import { notFound } from 'next/navigation';

import SavingsCalculator from '@/components/SavingsCalculator';
import { fetchDepartmentCatalogue } from '@/lib/api/departmentCatalogue';
import { publishedPrices } from '@/lib/departmentPrices';
import { findPack, splitIncludes } from '@/lib/departmentCatalogue';
import { DISCLAIMER, DRAFT_DEPARTMENT_PAGES, SAVINGS_PAGES_LIVE, canShowSavingsDraft, money } from '@/lib/savings';
import { pageMetadata } from '@/lib/seo';

// A Department, sold on what it takes off the team (Robert, 3 November 2026;
// WEBSITE_VALUE_AND_SAVINGS_V1.md item 3): what the customer pays for, what it does each
// week, the work it takes off the team, the dashboards and reports, and what stays under
// their control. Content from Global's catalogue. A DRAFT: not found without ?preview=1
// and never indexed until SAVINGS_PAGES_LIVE is on; Finance only for now.
export const dynamic = 'force-dynamic';

export async function generateMetadata(props) {
  const { slug } = await props.params;
  const { entries } = await fetchDepartmentCatalogue();
  const pack = findPack(entries, slug);
  if (!pack) return {};
  const metadata = pageMetadata({
    title: `${pack.name} Department: what it takes off your team | Teracom AI`,
    description: (pack.description || '').slice(0, 300),
    path: `/teracom-ai/departments/${pack.slug}`,
  });
  return SAVINGS_PAGES_LIVE ? metadata : { ...metadata, robots: { index: false, follow: false } };
}

export default async function DepartmentPage(props) {
  const { slug } = await props.params;
  const searchParams = (await props.searchParams) || {};
  if (!canShowSavingsDraft(searchParams.preview) || !DRAFT_DEPARTMENT_PAGES.includes(slug)) notFound();
  const { entries } = await fetchDepartmentCatalogue();
  const pack = findPack(entries, slug);
  if (!pack || pack.kind !== 'department') notFound();
  const prices = publishedPrices();
  const price = prices?.[pack.slug];
  const { widgets, dashboards, reports } = splitIncludes(pack.includes);
  const departments = entries.filter((e) => e.kind === 'department' && e.slug !== 'personal').map((d) => ({ slug: d.slug, name: d.name }));
  const savings = `/teracom-ai/savings${SAVINGS_PAGES_LIVE ? '' : '?preview=1'}`;

  return (
    <main id="main-content">
      {!SAVINGS_PAGES_LIVE ? (
        <p className="draft-banner" role="status">Draft for Robert&apos;s review. Not public, not indexed. Wording and default figures to be approved before it goes live.</p>
      ) : null}
      <section className="hero hero-product hero-shallow">
        <div className="container">
          <div className="hero-copy">
            <span className="eyebrow">Teracom AI · Department</span>
            <h1>The {pack.name} Department</h1>
            {pack.description ? <p className="lead">{pack.description}</p> : null}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container copy-block">
          <h2>What you pay for</h2>
          <p>
            One monthly subscription for the {pack.name} Department{price ? `: ${money(price)} a month ex GST` : ''}. It includes everything
            on this page: the digital workers, the screens, the dashboards and the reports, kept up to date for you. There is no setup fee
            and no platform fee{price ? '' : ', and pricing will be published soon'}.
          </p>
          <p>
            What you get for it is time back: the {pack.name.toLowerCase()} work below is done for your team, every week, under your
            approval.
          </p>
        </div>
      </section>

      {pack.workerDetails.length ? (
        <section className="section section-spacious alt">
          <div className="container">
            <div className="section-heading left">
              <span className="eyebrow">What it takes off your team</span>
              <h2>The work it does each week</h2>
            </div>
            <div className="dept-grid">
              {pack.workerDetails.map((w) => (
                <article className="dept-card" key={w.name}>
                  <h3>{w.name}</h3>
                  {w.role ? <p>{w.role}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {widgets.length || dashboards.length || reports.length ? (
        <section className="section section-spacious">
          <div className="container">
            <div className="section-heading left">
              <span className="eyebrow">What you see</span>
              <h2>The questions it answers for you</h2>
            </div>
            {widgets.length ? (
              <dl className="pack-widgets">
                {widgets.map((w) => (
                  <div key={w.name}>
                    <dt>{w.question}</dt>
                    <dd>{w.name}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <div className="dept-split">
              {dashboards.length ? (
                <div>
                  <h3 className="dept-subhead">Dashboards</h3>
                  <ul className="tick-list">{dashboards.map((d) => <li key={d}>{d}</li>)}</ul>
                </div>
              ) : null}
              {reports.length ? (
                <div>
                  <h3 className="dept-subhead">Reports</h3>
                  <ul className="tick-list">{reports.map((r) => <li key={r}>{r}</li>)}</ul>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {pack.howItWorks ? (
        <section className="section alt">
          <div className="container copy-block">
            <h2>What stays under your control</h2>
            <p>{pack.howItWorks}</p>
          </div>
        </section>
      ) : null}

      <section className="section section-spacious">
        <div className="container">
          <div className="section-heading left">
            <span className="eyebrow">Your figures</span>
            <h2>What could the {pack.name} Department save you?</h2>
            <p>For example, a {pack.name.toLowerCase()} team of ten handing over half its work is five people&apos;s work: 5 x A$100,000 = A$500,000 a year. Change the figures to match your business.</p>
          </div>
          <SavingsCalculator departments={departments} prices={prices} initial={{ department: pack.slug, teamSize: 10, sharePercent: 50 }} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p>
            <Link href={savings}>More ways to save</Link> · <Link href={`/store/teracom-ai/${pack.slug}`}>{pack.name} in the store</Link> ·{' '}
            <Link href={`/?interest=${encodeURIComponent(`Teracom AI ${pack.name}`)}#contact`}>Talk to us about {pack.name}</Link>
          </p>
          <p className="savings-disclaimer">{DISCLAIMER}</p>
        </div>
      </section>
    </main>
  );
}
