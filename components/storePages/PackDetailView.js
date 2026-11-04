import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BarChart3, Bot, FileText, LayoutDashboard, ShieldCheck, Users } from 'lucide-react';

import { fetchDepartmentCatalogue } from '@/lib/api/departmentCatalogue';
import { KIND_LABELS, findPack, slugOf, splitIncludes } from '@/lib/departmentCatalogue';
import { pageMetadata } from '@/lib/seo';
import { publishedPrices } from '@/lib/departmentPrices';
import { BASE_PLATFORM_MONTHLY, GST_RATE, NO_SAVINGS_PAGE, money, monthlyMoney } from '@/lib/savings';
import { interestLink } from '@/components/storePages/TeracomAiStoreView';

// One Teracom AI pack in the store (Robert, 2026-11-03: describe in detail exactly what is
// in each Department, so customers know what they are buying and how it works): what it
// does, every screen and the question it answers, its dashboards and reports, what each
// digital worker does, what always stays with a person, and what it works with. All of
// it from Global's catalogue, with its published price and the base platform.
export async function packMetadata(slug) {
  const { entries } = await fetchDepartmentCatalogue();
  const pack = findPack(entries, slug);
  if (!pack) return {};
  return pageMetadata({
    title: `${pack.name} ${pack.kind === 'department' ? 'Department' : 'pack'} | Teracom AI | Teracom Store`,
    description: (pack.description || `${pack.name} for Teracom AI.`).slice(0, 300),
    path: `/store/teracom-ai/${pack.slug}`,
  });
}

export default async function PackDetailView({ slug }) {
  const { entries } = await fetchDepartmentCatalogue();
  const pack = findPack(entries, slug);
  if (!pack) notFound();
  const { widgets, dashboards, reports, other } = splitIncludes(pack.includes);
  const price = publishedPrices()?.[pack.slug];
  const related = pack.connectsTo
    .map((name) => entries.find((e) => slugOf(e.name) === slugOf(name)))
    .filter(Boolean);
  const extensions = entries.filter((e) => e.kind === 'extension' && pack.kind === 'department' && slugOf(e.group) === slugOf(pack.group || pack.name));

  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow store-hero">
        <div className="container">
          <div className="hero-copy">
            <span className="eyebrow">
              <Link href="/store/teracom-ai" style={{ color: 'inherit' }}>Teracom AI</Link> · {KIND_LABELS[pack.kind] || 'Pack'}
              {pack.kind !== 'department' && pack.group ? ` · ${pack.group}` : ''}
            </span>
            <h1>{pack.name}</h1>
            {pack.description ? <p className="lead">{pack.description}</p> : null}
            <p className="store-gst">
              {[pack.tiers.length ? `Included in ${pack.tiers.join(', ')}` : '', pack.version ? `Version ${pack.version}` : '']
                .filter(Boolean)
                .join(' · ')}
            </p>
            <div className="ai-pack-actions">
              <Link className="btn btn-primary" href={interestLink(pack.name)}>Register interest</Link>
              <span className="price">{price ? `Early access · ${monthlyMoney((price + BASE_PLATFORM_MONTHLY) * (1 + GST_RATE))} a month incl. GST (${money(price)} plus the ${money(BASE_PLATFORM_MONTHLY)} base platform, ex GST)` : 'Early access · pricing coming soon'}</span>
            </div>
          </div>
        </div>
      </section>

      {pack.howItWorks ? (
        <section className="section">
          <div className="container copy-block">
            <h2><ShieldCheck size={22} aria-hidden="true" /> How it works</h2>
            <p>{pack.howItWorks}</p>
          </div>
        </section>
      ) : null}

      {widgets.length || dashboards.length || reports.length || other.length ? (
        <section className="section section-spacious alt">
          <div className="container">
            <div className="section-heading left">
              <span className="eyebrow">What it includes</span>
              <h2>Screens, dashboards and reports</h2>
            </div>
            {widgets.length ? (
              <>
                <h3 className="dept-subhead"><BarChart3 size={18} aria-hidden="true" /> On screen, and the question each one answers</h3>
                <dl className="pack-widgets">
                  {widgets.map((w) => (
                    <div key={w.name}>
                      <dt>{w.name}</dt>
                      <dd>{w.question}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : null}
            <div className="dept-split">
              {dashboards.length ? (
                <div>
                  <h3 className="dept-subhead"><LayoutDashboard size={18} aria-hidden="true" /> Dashboards</h3>
                  <ul className="tick-list">{dashboards.map((d) => <li key={d}>{d}</li>)}</ul>
                </div>
              ) : null}
              {reports.length ? (
                <div>
                  <h3 className="dept-subhead"><FileText size={18} aria-hidden="true" /> Reports</h3>
                  <ul className="tick-list">{reports.map((r) => <li key={r}>{r}</li>)}</ul>
                </div>
              ) : null}
            </div>
            {other.length ? <ul className="tick-list">{other.map((o) => <li key={o}>{o}</li>)}</ul> : null}
          </div>
        </section>
      ) : null}

      {pack.workerDetails.length ? (
        <section className="section section-spacious">
          <div className="container">
            <div className="section-heading left">
              <span className="eyebrow"><Users size={16} aria-hidden="true" /> Digital workers</span>
              <h2>What its digital workers are designed to do</h2>
              <p>Each worker advises, tracks and drafts. Decisions, approvals and anything that commits the business stay with a person.</p>
            </div>
            <div className="dept-grid">
              {pack.workerDetails.map((w) => (
                <article className="dept-card" key={w.name}>
                  <h3><Bot size={18} aria-hidden="true" /> {w.name}</h3>
                  {w.role ? <p>{w.role}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length || extensions.length ? (
        <section className="section alt">
          <div className="container">
            <h2>Works with</h2>
            <ul className="dept-list">
              {[...extensions, ...related.filter((r) => !extensions.includes(r))].map((r) => (
                <li key={r.slug}>
                  <strong><Link href={`/store/teracom-ai/${r.slug}`}>{r.name}</Link></strong>
                  <span>{KIND_LABELS[r.kind]}{r.description ? `: ${r.description.slice(0, 180)}${r.description.length > 180 ? '...' : ''}` : ''}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <p>
            <Link href="/store/teracom-ai">← All Teracom AI Departments and packs</Link> · <Link href="/teracom-ai">How Teracom AI works</Link> ·{' '}
            {pack.kind === 'department' && !NO_SAVINGS_PAGE.includes(pack.slug) ? <><Link href={`/teracom-ai/departments/${pack.slug}`}>What {pack.name} could save you</Link> ·{' '}</> : null}
            <Link href={interestLink(pack.name)}>Ask us about {pack.name}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
