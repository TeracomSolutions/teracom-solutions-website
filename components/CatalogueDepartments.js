import Link from 'next/link';

import { groupCatalogue } from '@/lib/departmentCatalogue';
import { departmentPagePath } from '@/lib/savings';

// Every Department and extension pack in Global's catalogue (rule 7 of
// DEPARTMENT_PACK_SYNC_AND_FRESHNESS_2026-11-03): what each does, how it is sold (no
// plans any more, priced per Department), its version and its digital workers, grouped
// by Global's "group". No prices.
// Each card opens the pack's own page in the store with everything it includes.
export const INDUSTRY_NOTE = 'Extensions for one industry, such as CCTV, access control and alarms, that work across several Departments.';

// No worker counts (CTO, 3 November 2026): one price per Department, sold on what it does.
// A short vertical list (Robert, 20 November 2026: the cards were far too big): each line is the name, the first
// sentence of what it does and two links; the full detail is on each pack's own page. Extension packs fold away.
export const firstSentence = (text) => {
  const t = String(text || '').trim();
  const m = t.match(/^.*?[.!?](?=\s|$)/);
  // Up to the first dash aside too, so each line stays one short line.
  return (m ? m[0] : t).split(/\s+(?:--|—)\s+/)[0].replace(/[.!?]?$/, '.');
};

function Row({ pack, savings = false }) {
  return (
    <li className="dept-row">
      <Link className="dept-row-name" href={`/store/teracom-ai/${pack.slug}`}>{pack.name}</Link>
      <span className="dept-row-text">{firstSentence(pack.description)}</span>
      <span className="dept-row-links">
        {savings && departmentPagePath(pack.slug).startsWith('/teracom-ai/') ? <Link href={departmentPagePath(pack.slug)}>Savings</Link> : null}
        <Link href={`/store/teracom-ai/${pack.slug}`}>Details</Link>
      </span>
    </li>
  );
}

export default function CatalogueDepartments({ entries, alt = false }) {
  const { departments, sections } = groupCatalogue(entries);
  return (
    <section className={`section${alt ? ' alt' : ''}`} id="departments">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Departments</span>
          <h2>Deploy a Department. Or build an entire AI organisation.</h2>
          <p>
            Each Department brings its own digital workers, dashboards and reports, working from one organisational
            memory and under your approval. Open one to see exactly what it includes.
          </p>
        </div>
        <ul className="dept-rows">
          {departments.map((dept) => <Row key={dept.slug} pack={dept} savings />)}
        </ul>
        {sections.map((section) => (
          <details key={section.title} className="dept-fold">
            <summary>{section.title} ({section.packs.length})</summary>
            {/industry/i.test(section.title) ? <p className="dept-note">{INDUSTRY_NOTE}</p> : null}
            <ul className="dept-rows">
              {section.packs.map((pack) => <Row key={pack.slug} pack={pack} />)}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}
