'use client';

// "Ask Tera" from a product or calculator page (Ask Tera phase 5): opens the
// chat window with a question already typed, for the visitor to change or
// send. AskTeraWidget listens for the tera:ask event.
export function askTera(question) {
  window.dispatchEvent(new CustomEvent('tera:ask', { detail: { question } }));
}

export default function AskTeraNudge({ question, label = 'Ask Tera' }) {
  return (
    <button type="button" className="tera-nudge" onClick={() => askTera(question)}>
      {label}
    </button>
  );
}