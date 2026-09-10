'use client';

import { useMemo, useState } from 'react';
import { helpCenterTopics } from '@/lib/helpCenterTopics';

function renderMultiline(text) {
  return text.split('\n\n').map((block, blockIndex) => (
    <p key={blockIndex}>
      {block.split('\n').map((line, lineIndex, lines) => (
        <span key={lineIndex}>
          {line}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      ))}
    </p>
  ));
}

function HelpCenterTopic({ topic, forceOpen }) {
  const [open, setOpen] = useState(false);
  const isOpen = forceOpen || open;

  return (
    <article className="help-topic">
      <button
        type="button"
        className="help-topic-toggle"
        aria-expanded={isOpen}
        aria-controls={`help-topic-panel-${topic.slug}`}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="help-topic-toggle-text">
          <span className="help-topic-title">{topic.title}</span>
          <span className="help-topic-count">{topic.faqs.length} questions</span>
        </span>
        <span className="help-topic-indicator" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && (
        <div id={`help-topic-panel-${topic.slug}`} className="help-topic-panel">
          <div className="help-topic-intro">{renderMultiline(topic.intro)}</div>
          {topic.faqs.map((faq) => (
            <div className="help-faq" key={faq.q}>
              <p className="help-faq-q">{faq.q}</p>
              <div className="help-faq-a">{renderMultiline(faq.a)}</div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default function HelpCenterAccordion() {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return helpCenterTopics.map((topic) => ({ topic, matched: false }));
    }
    return helpCenterTopics
      .map((topic) => {
        const topicTextMatches =
          topic.title.toLowerCase().includes(normalizedQuery) || topic.intro.toLowerCase().includes(normalizedQuery);
        const matchingFaqs = topic.faqs.filter(
          (f) => f.q.toLowerCase().includes(normalizedQuery) || f.a.toLowerCase().includes(normalizedQuery)
        );
        if (!topicTextMatches && matchingFaqs.length === 0) return null;
        return {
          topic: topicTextMatches ? topic : { ...topic, faqs: matchingFaqs },
          matched: true,
        };
      })
      .filter(Boolean);
  }, [normalizedQuery]);

  return (
    <div>
      <div className="help-search">
        <input
          type="search"
          placeholder="Search help articles and FAQs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search the Help Centre"
        />
      </div>

      {normalizedQuery && results.length === 0 && (
        <p className="form-note-banner" role="status" style={{ marginTop: '24px' }}>
          No results for &quot;{query}&quot; -- try a different term, or{' '}
          <a href="/#contact" style={{ color: 'var(--text)', textDecoration: 'underline' }}>
            contact us
          </a>
          .
        </p>
      )}

      <div className="help-accordion">
        {results.map(({ topic, matched }) => (
          <HelpCenterTopic key={topic.slug} topic={topic} forceOpen={matched} />
        ))}
      </div>
    </div>
  );
}
