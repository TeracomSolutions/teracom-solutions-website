'use client';

import { useState } from 'react';
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

function HelpCenterTopic({ topic }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="help-topic">
      <button
        type="button"
        className="help-topic-toggle"
        aria-expanded={open}
        aria-controls={`help-topic-panel-${topic.slug}`}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="help-topic-toggle-text">
          <span className="help-topic-title">{topic.title}</span>
          <span className="help-topic-count">{topic.faqs.length} questions</span>
        </span>
        <span className="help-topic-indicator" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      <div className="help-topic-intro">{renderMultiline(topic.intro)}</div>

      {open && (
        <div id={`help-topic-panel-${topic.slug}`} className="help-topic-panel">
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
  return (
    <div className="help-accordion">
      {helpCenterTopics.map((topic) => (
        <HelpCenterTopic key={topic.slug} topic={topic} />
      ))}
    </div>
  );
}
