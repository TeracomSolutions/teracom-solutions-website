import Link from 'next/link';

import SavingsCalculator from '@/components/SavingsCalculator';
import { fetchDepartmentCatalogue } from '@/lib/api/departmentCatalogue';
import { publishedPrices } from '@/lib/departmentPrices';
import { AVAILABILITY, DISCLAIMER, GOALS, NOT_MEASURED, SAVINGS_PAGES_LIVE, arithmetic, costAndNet, departmentPagePath, money, optionTotal } from '@/lib/savings';
import { pageMetadata } from '@/lib/seo';

// What Teracom AI could save (Robert, 3 November 2026; teracom-ai-docs
// Workstreams/WEBSITE_VALUE_AND_SAVINGS_V1.md). Live since Robert approved it on 3 November
// 2026; one saved copy for everyone, refreshed hourly with Global's catalogue.
export const revalidate = 3600;

const metadata = pageMetadata({
  title: 'What could Teracom AI save you? | Teracom Solutions',
  description: 'Work out what handing work to Teracom AI Departments could save your business each year, with your own figures and the working shown.',
  path: '/teracom-ai/savings',
});

export async function generateMetadata() {
  return SAVINGS_PAGES_LIVE ? metadata : { ...metadata, robots: { index: false, follow: false } };
}

const departmentHref = departmentPagePath;

export default async function SavingsPage() {
  const { entries } = await fetchDepartmentCatalogue();
  const departments = entries.filter((e) => e.kind === 'department' && e.slug !== 'personal').map((d) => ({ slug: d.slug, name: d.name }));
  const prices = await publishedPrices();

  return (
    <main id="main-content">
      {!SAVINGS_PAGES_LIVE ? (
        <p className="draft-banner" role="status">Draft for Robert&apos;s review. Not public, not indexed. Wording and default figures to be approved before it goes live.</p>
      ) : null}
      <section className="hero hero-product hero-shallow">
        <div className="container">
          <div className="hero-copy">
            <span className="eyebrow">Teracom AI · Savings</span>
            <h1>Want to save A$250,000 a year? See what it would take.</h1>
            <p className="lead">
              Teracom AI Departments are designed to take work off your team: the tracking, chasing, drafting and reporting that fills their week.
              Its value to you is the cost of the time your team no longer has to spend. Put in your own figures below and see the working.
            </p>
            <p className="savings-qualifier">{NOT_MEASURED}</p>
            <p className="savings-qualifier">{AVAILABILITY} <Link href="/?interest=Teracom%20AI#contact">Register interest</Link></p>
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          <div className="section-heading left">
            <span className="eyebrow">Your figures</span>
            <h2>What could you save?</h2>
            <p>Choose a Department, enter the team that does that work today, and how much of it you expect to hand over.</p>
          </div>
          <SavingsCalculator departments={departments} prices={prices} />
        </div>
      </section>

      {GOALS.map((goal) => (
        <section className="section section-spacious alt" key={goal.target}>
          <div className="container">
            <div className="section-heading left">
              <span className="eyebrow">Savings goal</span>
              <h2>{goal.title}: some ways to get there</h2>
              <p>Examples only, at A$100,000 a person a year, not results from a real business. Change the figures in the calculator above to match yours.</p>
            </div>
            <div className="savings-options">
              {goal.options.map((option) => {
                const total = optionTotal(option);
                const priced = costAndNet(option.rows.map((r) => r.department), total.saving, prices);
                return (
                  <article className="dept-card" key={option.title}>
                    <h3>{option.title}</h3>
                    <p className="admin-muted">{option.business}.</p>
                    <ul className="savings-lines">
                      {total.rows.map((r) => (
                        <li key={r.department}>
                          <Link href={departmentHref(r.department)}>{r.name}</Link>: {arithmetic({ ...r, costPerPerson: 100000 })}
                        </li>
                      ))}
                    </ul>
                    <p className="savings-option-total">
                      Example total: {money(total.saving)} a year
                      {priced.yearlyCost != null ? `, less ${money(priced.yearlyCost)} for the Departments and the base platform = ${money(priced.net)}` : ''}
                    </p>
                  </article>
                );
              })}
            </div>
            <p className="savings-disclaimer">{DISCLAIMER}</p>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container copy-block">
          <h2>How these numbers work</h2>
          <p>
            A saving here is the share of a team&apos;s work handed to a Department, times the people in that team, times what one
            person costs you a year. A finance team of ten that hands over half its work is five people&apos;s work: 5 x A$100,000 =
            A$500,000 a year. Whether you reduce the team, grow without hiring, or move people to other work is your decision.
          </p>
          <p>
            The share of the work a Department takes on is your estimate. We have not yet measured it at customer sites; when our first
            customers have used the Departments for a month we will publish what we measured and replace these examples with it.
          </p>
          <p>
            The Department works under your approval: it tracks, chases, drafts and reports, and decisions stay with your people. See{' '}
            <Link href={departmentHref('finance')}>what the Finance Department takes off your team</Link>, or{' '}
            <Link href="/store/teracom-ai">every Department</Link>.
          </p>
          <p className="savings-disclaimer">{DISCLAIMER}</p>
        </div>
      </section>
    </main>
  );
}
