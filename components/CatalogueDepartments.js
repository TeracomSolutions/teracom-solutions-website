import Link from 'next/link';

import { groupCatalogue } from '@/lib/departmentCatalogue';
import { departmentPagePath } from '@/lib/savings';

// Every Department and extension pack in Global's catalogue (rule 7 of
// DEPARTMENT_PACK_SYNC_AND_FRESHNESS_2026-11-03): what each does, which tiers include
// it, its version and its digital workers, grouped by Global's "group". No prices.
// Each card opens the pack's own page in the store with everything it includes.
export const INDUSTRY_NOTE = 'Extensions for one industry, such as CCTV, access control and alarms, that work across several Departments.';

// No worker counts (CTO, 3 November 2026): one price per Department, sold on what it does.
function Meta({ pack }) {
  const bits = [pack.tiers.length ? `Included in ${pack.tiers.join(', ')}` : '', pack.version ? `Version ${pack.version}` : ''];
  return <p className="dept-meta">{bits.filter(Boolean).join(' · ')}</p>;
}

export default function CatalogueDepartments({ entries, alt = false }) {
  const { departments, sections } = groupCatalogue(entries);
  return (
    <section className={`section section-spacious${alt ? ' alt' : ''}`} id="departments">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Departments</span>
          <h2>Deploy a Department. Or build an entire AI organisation.</h2>
          <p>
            Each Teracom AI Department brings its own digital workers, dashboards and reports, all working from one
            organisational memory and under your approval. Open any one to see exactly what it includes and how it works.
          </p>
        </div>
        <div className="dept-grid">
          {departments.map((dept) => (
            <article className="dept-card" key={dept.slug}>
              <h3>{dept.name}</h3>
              {dept.description ? <p>{dept.description}</p> : null}
              {dept.workerDetails.length ? (
                <p className="dept-workers"><strong>Workers:</strong> {dept.workerDetails.map((w) => w.name).join(', ')}</p>
              ) : null}
              {dept.extensions.length ? (
                <p className="dept-workers"><strong>Extension packs:</strong> {dept.extensions.map((e) => e.name).join(', ')}</p>
              ) : null}
              <Meta pack={dept} />
              <Link className="dept-more" href={departmentPagePath(dept.slug)}>What it could save you →</Link>{' '}
              <Link className="dept-more" href={`/store/teracom-ai/${dept.slug}`}>What it includes →</Link>
            </article>
          ))}
        </div>
        {sections.map((section) => (
          <div key={section.title} className="dept-section">
            <h3 className="dept-subhead">{section.title}</h3>
            {/industry/i.test(section.title) ? <p className="dept-note">{INDUSTRY_NOTE}</p> : null}
            <div className="dept-grid">
              {section.packs.map((pack) => (
                <article className="dept-card" key={pack.slug}>
                  <h3>{pack.name}</h3>
                  {pack.description ? <p>{pack.description}</p> : null}
                  {pack.connectsTo.length ? <p className="dept-workers"><strong>Works with:</strong> {pack.connectsTo.join(', ')}</p> : null}
                  <Meta pack={pack} />
                  <Link className="dept-more" href={`/store/teracom-ai/${pack.slug}`}>What it includes →</Link>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
