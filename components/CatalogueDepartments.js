import { groupCatalogue } from '@/lib/departmentCatalogue';

// Every Department and extension pack in Global's catalogue (rule 7 of
// DEPARTMENT_PACK_SYNC_AND_FRESHNESS_2026-11-03): what each does, which tiers include
// it, its version and its digital workers. No prices. Used on /teracom-ai once the
// live catalogue is switched on (lib/departmentCatalogue.js USE_LIVE_CATALOGUE).
const workersText = (workers) => (typeof workers === 'number' ? `${workers} digital workers` : workers.join(', '));

export default function CatalogueDepartments({ entries, alt = false }) {
  const { departments, loose } = groupCatalogue(entries);
  return (
    <section className={`section section-spacious${alt ? ' alt' : ''}`} id="departments">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Departments</span>
          <h2>Deploy a Department. Or build an entire AI organisation.</h2>
          <p>
            Each Teracom AI Department brings its own digital workers, dashboards and reports, all working from one
            organisational memory and under your approval. Extension packs add to a Department when you switch them on.
          </p>
        </div>
        <div className="dept-grid">
          {departments.map((dept) => (
            <article className="dept-card" key={dept.slug}>
              <h3>{dept.name}</h3>
              {dept.description ? <p>{dept.description}</p> : null}
              {(Array.isArray(dept.workers) ? dept.workers.length : dept.workers) ? (
                <p className="dept-workers"><strong>Workers:</strong> {workersText(dept.workers)}</p>
              ) : null}
              {dept.tiers.length ? <p className="dept-workers"><strong>Included in:</strong> {dept.tiers.join(', ')}</p> : null}
              {dept.extensions.length ? (
                <ul className="dept-extensions">
                  {dept.extensions.map((ext) => (
                    <li key={ext.slug}>
                      <strong>{ext.name}</strong>
                      {ext.description ? <span> {ext.description}</span> : null}
                      {ext.tiers.length ? <span className="dept-meta"> Included in {ext.tiers.join(', ')}.</span> : null}
                    </li>
                  ))}
                </ul>
              ) : null}
              {dept.version ? <p className="dept-meta">Version {dept.version}</p> : null}
            </article>
          ))}
        </div>
        {loose.length ? (
          <>
            <h3 className="dept-subhead">More extension packs</h3>
            <ul className="dept-list">
              {loose.map((ext) => (
                <li key={ext.slug}>
                  <strong>{ext.name}</strong>
                  <span>{ext.description}{ext.tiers.length ? ` Included in ${ext.tiers.join(', ')}.` : ''}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}
