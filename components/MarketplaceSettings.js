'use client';

import { useState } from 'react';
import AdminConnectionForm from '@/components/AdminConnectionForm';
import { statusSentences } from '../lib/marketplaceView.js';

export default function MarketplaceSettings({ status, connection, onChanged }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const markup = status && status.settings ? status.settings.default_markup : 40;
  const usdToAud = status && status.settings ? status.settings.usd_to_aud : 1.55;

  return (
    <section className="admin-card">
      <h2>Settings</h2>
      <ul>
        {statusSentences(status).map((sentence) => (
          <li key={sentence}>{sentence}</li>
        ))}
      </ul>
      <p className="admin-muted">
        Default markup {markup}%. Supplier prices are converted at A${usdToAud} per US dollar.
      </p>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? 'Close' : 'Change settings'}
      </button>
      {open && connection ? (
        <AdminConnectionForm
          connection={connection}
          onSaved={(done) => {
            setOpen(false);
            setMessage(done);
            if (onChanged) onChanged();
          }}
          onCancel={() => setOpen(false)}
        />
      ) : null}
      {open && !connection ? (
        <p className="form-error">The settings could not be loaded. Reload the page.</p>
      ) : null}
      {message ? (
        <p className="admin-muted" role="status">{message}</p>
      ) : null}
    </section>
  );
}
