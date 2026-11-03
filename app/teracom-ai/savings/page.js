import Link from 'next/link';
import { notFound } from 'next/navigation';

import SavingsCalculator from '@/components/SavingsCalculator';
import { fetchDepartmentCatalogue } from '@/lib/api/departmentCatalogue';
import { publishedPrices } from '@/lib/departmentPrices';
import { DISCLAIMER, DRAFT_DEPARTMENT_PAGES, GOALS, SAVINGS_PAGES_LIVE, arithmetic, canShowSavingsDraft, costAndNet, money, optionTotal } from '@/lib/savings';
import { pageMetadata } from '@/lib/seo';

// What Teracom AI could save (Robert, 3 November 2026; teracom-ai-docs
// Workstreams/WEBSITE_VALUE_AND_SAVINGS_V1.md). A DRAFT for Robert's review: without
// ?preview=1 it is not found, and it is never indexed, until SAVINGS_PAGES_LIVE is on.
export const dynamic = 'force-dynamic';

const metadata = pageMetadata({
  title: 'What could Teracom AI save you? | Teracom Solutions',
  description: 'Work out what handing work to Teracom AI Departments could save your business each year, with your own figures and the working shown.',
  path: '/teracom-ai/savings',
});

export async function generateMetadata() {
  return SAVINGS_PAGES_LIVE ? metadata : { ...metadata, robots: { index: false, follow: false } };
}

const departmentHref = (slug) => (DRAFT_DEPARTMENT_PAGES.includes(slug) ? `/teracom-ai/departments/${slug}${SAVINGS_PAGES_LIVE ? '' : '?preview=1'}` : `/store/teracom-ai/${slug}`);

export default async function SavingsPage(props) {
  const searchParams = (await props.searchParams) || {};
  if (!canShowSavingsDraft(searchParams.preview)) notFound();
  const { entries } = await fetchDepartmentCatalogue();
  const departments = entries.filter((e) => e.kind === 'department' && e.slug !== 'personal').map((d) => ({ slug: d.slug, name: d.name }));
  const prices = publishedPrices();

  return (
    <main id="main-content">
      {!SAVINGS_PAGES_LIVE ? (
        <p className="draft-banner" role="status">Draft for Robert&apos;s review. Not public, not indexed. Wording and default figures to be approved before it goes live.</p>
      ) : null}
      <section className="hero hero-product hero-shallow">
        <div className="container">
          <div className="hero-copy">
            <span className="eyebrow">Teracom AI · Savings</span>
            <h1>Do you want to save A$250,000 a year? Here are your options.</h1>
            <p className="lead">
              Teracom AI Departments take work off your team: the tracking, chasing, drafting and reporting that fills their week.
              The value is the cost of the time you no longer need to spend. Put in your own figures below and see the working.
            </p>
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
              <p>Illustrative examples at A$100,000 a person a year. Change the figures in the calculator above to match your business.</p>
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
                      Total: {money(total.saving)} a year
                      {priced.yearlyCost != null ? `, less ${money(priced.yearlyCost)} for the Departments = ${money(priced.net)}` : ''}
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
