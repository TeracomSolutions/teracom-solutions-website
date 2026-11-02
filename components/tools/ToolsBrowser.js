'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, Info, ShieldCheck, Cable, Cctv, ChevronDown, ChevronsDownUp, ChevronsUpDown, DoorOpen, Network, Search, Server, Speaker, Zap } from 'lucide-react';
import ToolIcon from '@/components/tools/ToolIcon';

// /tools (Robert, 2026-11-02): every area is a coloured section that folds up,
// with Expand all / Collapse all and a search across every tool. Opened from a
// calculator's breadcrumb (?category=), only that area starts open.
const GROUP_ICONS = { cctv: Cctv, power: Zap, cabling: Cable, network: Network, av: Speaker, it: Server, security: DoorOpen, cyber: ShieldCheck, ai: Bot };

export default function ToolsBrowser({ groups, tools, initialOpen }) {
  const [open, setOpen] = useState(() => new Set(initialOpen || groups.map((g) => g.id)));
  const [query, setQuery] = useState('');

  const needle = query.trim().toLowerCase();
  const matches = useMemo(
    () => (needle ? tools.filter((t) => `${t.title} ${t.description}`.toLowerCase().includes(needle)) : tools),
    [tools, needle],
  );

  const toggle = (id) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const allOpen = groups.every((g) => open.has(g.id));

  return (
    <div className="container tools-browser">
      <div className="tools-browser-bar">
        <label className="tools-browser-search">
          <Search size={18} strokeWidth={2} aria-hidden="true" />
          <input type="search" aria-label="Search the tools" placeholder={`Search ${tools.length} tools`} value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="tools-browser-buttons">
          <button type="button" className="btn btn-secondary" onClick={() => setOpen(new Set(groups.map((g) => g.id)))} disabled={allOpen}>
            <ChevronsUpDown size={18} strokeWidth={2} aria-hidden="true" /> Expand all
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setOpen(new Set())} disabled={!open.size}>
            <ChevronsDownUp size={18} strokeWidth={2} aria-hidden="true" /> Collapse all
          </button>
        </div>
      </div>

      <nav className="tools-browser-chips" aria-label="Tool areas">
        {groups.map((g) => {
          const Icon = GROUP_ICONS[g.id] || Server;
          return (
            <a
              key={g.id}
              href={`#tools-${g.id}`}
              className="tools-chip"
              style={{ '--tool-accent': g.color }}
              onClick={() => setOpen((current) => new Set(current).add(g.id))}
            >
              <Icon size={16} strokeWidth={2} aria-hidden="true" /> {g.eyebrow}
            </a>
          );
        })}
      </nav>

      {needle && !matches.length ? <p className="tools-browser-empty">No tool matches &quot;{query}&quot;.</p> : null}

      {groups.map((g) => {
        const list = matches.filter((t) => t.group === g.id);
        if (!list.length) return null;
        const Icon = GROUP_ICONS[g.id] || Server;
        // A search opens every area that has a match.
        const isOpen = needle ? true : open.has(g.id);
        return (
          <section className={`tools-area${isOpen ? ' open' : ''}`} id={`tools-${g.id}`} key={g.id} style={{ '--tool-accent': g.color }}>
            <h2 className="tools-area-heading">
              <button type="button" aria-expanded={isOpen} aria-controls={`tools-${g.id}-list`} onClick={() => toggle(g.id)} disabled={Boolean(needle)}>
                <span className="tools-area-icon" aria-hidden="true">
                  <Icon size={26} strokeWidth={1.8} />
                </span>
                <span className="tools-area-text">
                  <span className="tools-area-name">{g.eyebrow}</span>
                  <span className="tools-area-title">{g.title}</span>
                </span>
                <span className="tools-area-count">{list.length}</span>
                <ChevronDown className="tools-area-chevron" size={22} strokeWidth={2} aria-hidden="true" />
              </button>
            </h2>
            {isOpen && g.disclaimer ? (
              <p className="tools-area-note">
                <Info size={18} strokeWidth={2} aria-hidden="true" />
                <span>{g.disclaimer}</span>
              </p>
            ) : null}
            {isOpen ? (
              <div className="tools-grid" id={`tools-${g.id}-list`}>
                {list.map((tool) => (
                  <Link href={`/tools/${tool.slug}`} className="tool-card" key={tool.slug}>
                    <span className="tool-card-icon">
                      <ToolIcon slug={tool.slug} size={26} />
                    </span>
                    {tool.isNew ? <span className="tool-card-new">New</span> : null}
                    <h3>{tool.title}</h3>
                    <p>{tool.description}</p>
                    <span className="tool-card-cta">
                      Open the tool <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <span className="tool-card-watermark" aria-hidden="true">
                      <ToolIcon slug={tool.slug} size={150} strokeWidth={1} />
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
