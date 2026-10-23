'use client';

import { useState } from 'react';

import { parseBlocks, parseInline } from '@/lib/chatMarkdown';

function Inline({ text }) {
  return parseInline(text).map((part, index) => {
    if (part.t === 'bold') return <strong key={index}>{part.text}</strong>;
    if (part.t === 'code') return <code key={index} className="chat-inline-code">{part.text}</code>;
    if (part.t === 'link') return <a key={index} href={part.href} target="_blank" rel="noopener noreferrer">{part.text}</a>;
    return <span key={index}>{part.text}</span>;
  });
}

function CodeBlock({ block }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(block.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // The browser refused: the code can still be selected by hand.
    }
  }
  return (
    <div className="chat-code">
      <div className="chat-code-bar">
        <span>{block.lang || 'code'}</span>
        <button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <pre><code>{block.text}</code></pre>
    </div>
  );
}

// An Assistant reply, read as paragraphs, headings, lists, code blocks and links.
export default function ChatMarkdown({ text }) {
  return (
    <div className="chat-md">
      {parseBlocks(text).map((block, index) => {
        if (block.type === 'code') return <CodeBlock key={index} block={block} />;
        if (block.type === 'h') return <p key={index} className="chat-md-heading"><Inline text={block.text} /></p>;
        if (block.type === 'ul') return <ul key={index}>{block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}</ul>;
        if (block.type === 'ol') return <ol key={index}>{block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}</ol>;
        return <p key={index}><Inline text={block.text} /></p>;
      })}
    </div>
  );
}
