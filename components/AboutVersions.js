'use client';

import { useState } from 'react';

import { formatReleased } from '@/lib/aboutView';
import { FILTERS, filterLabel, filterVersions } from '@/lib/versionList';

// One list of released versions with the changes in each, newest first, and a Show filter.
export default function AboutVersions({ title, items }) {
  const [mode, setMode] = useState('all');
  const shown = filterVersions(items, mode);
  return (
    <section className="admin-card about-versions">
      <div className="about-versions-head">
        <h2>{title}</h2>
        <label>
          <span className="admin-muted">Show </span>
          <select value={mode} onChange={(event) => setMode(event.target.value)} aria-label={`Show which ${title.toLowerCase()}`}>
            {FILTERS.map((filter) => (
              <option key={filter.key} value={filter.key}>{filterLabel(filter, items.length)}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="about-versions-list">
        {shown.length === 0 ? <p className="admin-muted">Nothing in this range.</p> : null}
        {shown.map((entry) => (
          <div key={entry.version} className="about-version">
            <h3>{entry.version} <span className="admin-muted">-- {formatReleased(entry.date)}</span></h3>
            {entry.notes.map((note, index) => (
              <p key={index} className="admin-muted bullet">&bull; {note}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
