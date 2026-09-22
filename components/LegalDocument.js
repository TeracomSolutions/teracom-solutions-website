import Breadcrumbs from '@/components/Breadcrumbs';

// Shared layout for the legal pages (/privacy, /terms): glowing emblem hero,
// optional "at a glance" tiles, a sticky contents list and numbered sections.
//
// sections: [{ title: '1. Heading', body: [...] }]. A body entry is a string or
// JSX paragraph, or { label, text } for a labelled item card.
// highlights: [{ icon: LucideIcon, title, text }] shown above the sections.
function splitTitle(title) {
  const m = /^(\d+)\.\s*(.*)$/.exec(title);
  return m ? { num: m[1], text: m[2] } : { num: null, text: title };
}

// Runs of consecutive { label, text } entries become one grid of item cards.
function groupBody(body) {
  const blocks = [];
  for (const entry of body) {
    const isItem = entry && typeof entry === 'object' && 'label' in entry;
    if (isItem && Array.isArray(blocks[blocks.length - 1])) blocks[blocks.length - 1].push(entry);
    else blocks.push(isItem ? [entry] : entry);
  }
  return blocks;
}

function slugify(text) {
  return text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function LegalDocument({ icon: Icon, title, lead, updated, highlights = [], sections }) {
  const items = sections.map((s) => {
    const { num, text } = splitTitle(s.title);
    return { ...s, num, text, id: slugify(text) };
  });

  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[]} current={title} />
            <span className="eyebrow">Legal</span>
            <h1>{title}</h1>
            <p className="lead">{lead}</p>
            {updated ? <p className="legal-updated">Last updated {updated}</p> : null}
          </div>
          <div className="tool-hero-art" aria-hidden="true">
            <span className="tool-hero-ring">
              <Icon size={96} strokeWidth={1.3} aria-hidden="true" focusable="false" />
            </span>
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          {highlights.length > 0 && (
            <div className="legal-glance">
              {highlights.map(({ icon: HIcon, title: hTitle, text }) => (
                <div key={hTitle}>
                  <span className="tool-card-icon">
                    <HIcon size={22} strokeWidth={1.75} aria-hidden="true" focusable="false" />
                  </span>
                  <p>
                    <strong>{hTitle}</strong>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="legal-layout">
            <nav className="legal-toc" aria-label="On this page">
              <p>On this page</p>
              {items.map((s) => (
                <a href={`#${s.id}`} key={s.id}>
                  {s.num ? <span>{s.num}</span> : null}
                  {s.text}
                </a>
              ))}
            </nav>

            <div className="legal-body">
              {items.map((s) => (
                <section className="legal-section" id={s.id} key={s.id}>
                  <div className="legal-section-head">
                    {s.num ? <span className="legal-num">{s.num}</span> : null}
                    <h2>{s.text}</h2>
                  </div>
                  {groupBody(s.body).map((block, i) =>
                    Array.isArray(block) ? (
                      <div className="legal-items" data-count={block.length} key={i}>
                        {block.map((entry) => (
                          <div className="legal-item" key={entry.label}>
                            <strong>{entry.label}</strong>
                            <p>{entry.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p key={i}>{block}</p>
                    )
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
