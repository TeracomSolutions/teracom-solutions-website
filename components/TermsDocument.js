import { ShieldCheck } from 'lucide-react';

// Renders the generated terms document. Every block type in
// lib/termsDocument.js has a case here, so a new one shows up as a missing
// case rather than silently vanishing from a published legal document.

function Blocks({ blocks }) {
  const out = [];
  let bullets = [];

  const flush = (key) => {
    if (bullets.length === 0) return;
    out.push(
      <ul className="terms-bullets" key={`bullets-${key}`}>
        {bullets.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    );
    bullets = [];
  };

  blocks.forEach((block, i) => {
    if (block.type === 'bullet') {
      bullets.push(block.text);
      return;
    }
    flush(i);

    if (block.type === 'clause' || block.type === 'letter') {
      out.push(
        <p className={block.type === 'letter' ? 'terms-letter' : 'terms-clause'} key={i}>
          <span className="terms-number">{block.number}</span>
          <span>{block.text}</span>
        </p>
      );
      return;
    }

    if (block.type === 'definition') {
      out.push(
        <p className="terms-definition" key={i}>
          {block.text}
        </p>
      );
      return;
    }

    out.push(<p key={i}>{block.text}</p>);
  });

  flush('end');
  return out;
}

function Section({ section }) {
  // The ACL warranty statement is a prescribed form. It is reproduced word
  // for word, kept whole, and set apart so nobody mistakes it for ordinary
  // body copy or edits it to fit the page.
  if (section.prescribed) {
    return (
      <section className="terms-prescribed" id={section.id}>
        <h3>
          <ShieldCheck size={22} strokeWidth={1.8} aria-hidden="true" focusable="false" />
          {section.heading}
        </h3>
        <Blocks blocks={section.blocks} />
      </section>
    );
  }

  return (
    <section className="terms-section" id={section.id}>
      {section.heading ? (
        <h3>
          {section.number ? <span className="terms-section-number">{section.number}</span> : null}
          {section.heading}
        </h3>
      ) : null}
      <Blocks blocks={section.blocks} />
    </section>
  );
}

export default function TermsDocument({ parts }) {
  return (
    <>
      {parts.map((part) => (
        <section className="terms-part" id={part.id} key={part.id}>
          <h2>{part.title}</h2>
          {part.sections.map((section) => (
            <Section section={section} key={section.id} />
          ))}
        </section>
      ))}
    </>
  );
}

export { Blocks as TermsBlocks };
