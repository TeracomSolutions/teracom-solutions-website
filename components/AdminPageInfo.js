'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { pageFor } from '@/lib/adminPages';

// The About this page button on every console page: what the page is, how to get to it, what it
// shows and where that comes from, from the console page list (lib/adminPages.js).
export default function AdminPageInfo() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const page = pageFor(pathname);
  if (!page) return null;
  return (
    <div className="admin-page-info">
      <button type="button" className="admin-page-info-button" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span aria-hidden="true">i</span> About this page
      </button>
      {open && (
        <div className="admin-page-info-panel" role="region" aria-label="About this page">
          <p className="admin-page-info-title">{page.title}</p>
          <dl>
            <dt>What it is for</dt><dd>{page.what}</dd>
            <dt>How to get here</dt><dd>{page.menu || 'Not in the menu'} ({page.path})</dd>
            <dt>What you see</dt><dd>{page.shows}</dd>
            <dt>Where it comes from</dt><dd>{page.source}</dd>
            <dt>Who can open it</dt><dd>{page.access}</dd>
          </dl>
          <p className="admin-page-info-links">
            {page.guide ? <Link href={`/admin/guide#${page.guide}`}>Read the help for this page</Link> : null}
            <Link href="/admin/where">Where to find everything</Link>
          </p>
        </div>
      )}
    </div>
  );
}
