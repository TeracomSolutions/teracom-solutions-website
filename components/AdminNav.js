'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  Boxes,
  ChartColumn,
  ChevronDown,
  Cpu,
  FileText,
  Gauge,
  Headset,
  Inbox,
  Info,
  LayoutDashboard,
  Megaphone,
  Menu,
  Radar,
  ScrollText,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Ticket,
  X,
} from 'lucide-react';

import AdminSessionTimer from '@/components/AdminSessionTimer';
import { isAreaActive } from '@/lib/adminNavMatch';
import { areaVisible } from '../lib/permissionsView.js';

// The admin's own menu, down the left-hand side like the Global platform's (Robert, 2026-10-25).
// Every area is listed here and nowhere else: the public site never links to /admin, only the
// footer's double-click does. Areas sit under a heading; the Overview blocks follow the same order.
export const ADMIN_GROUPS = [
  { key: 'home', name: '' },
  { key: 'sell', name: 'Selling' },
  { key: 'customers', name: 'Customers' },
  { key: 'website', name: 'Website' },
  { key: 'ai', name: 'AI' },
  { key: 'system', name: 'System' },
];

export const ADMIN_AREAS = [
  { href: '/admin', label: 'Overview', exact: true, group: 'home' },
  { href: '/admin/sales', label: 'Sales', group: 'sell', match: ['/admin/orders'] },
  { href: '/admin/suppliers', label: 'Store', group: 'sell', match: ['/admin/catalog', '/admin/pricing', '/admin/brands', '/admin/freight', '/admin/review', '/admin/content', '/admin/marketplace'] },
  { href: '/admin/coupons', label: 'Coupons', group: 'sell' },
  { href: '/admin/marketing', label: 'Marketing', group: 'sell' },
  { href: '/admin/leads', label: 'Leads', group: 'customers' },
  { href: '/admin/support', label: 'Support', group: 'customers' },
  { href: '/admin/social', label: 'Social', group: 'customers' },
  { href: '/admin/website-data', label: 'Website Data', group: 'website' },
  { href: '/admin/resources', label: 'Resources', group: 'website' },
  { href: '/admin/scout', label: 'Scout', group: 'website' },
  { href: '/admin/assistant', label: 'Assistant', group: 'ai' },
  { href: '/admin/ai-connections', label: 'AI Connections', group: 'ai' },
  { href: '/admin/connections', label: 'Connections', group: 'system' },
  { href: '/admin/account', label: 'Account', group: 'system' },
  { href: '/admin/activity', label: 'Audit log', group: 'system' },
  { href: '/admin/build-progress', label: 'Build progress', group: 'system' },
  { href: '/admin/about', label: 'About', group: 'system' },
];

// The pages inside an area, shown as a sub-menu under it (the same pages as the area's own tabs).
export const ADMIN_SUBMENUS = {
  '/admin/sales': [
    { path: '/admin/orders', title: 'Orders' },
    { path: '/admin/sales', title: 'Sales' },
  ],
  '/admin/suppliers': [
    { path: '/admin/suppliers', title: 'Data Feeds' },
    { path: '/admin/catalog', title: 'Catalog' },
    { path: '/admin/pricing', title: 'Pricing' },
    { path: '/admin/brands', title: 'Brands' },
    { path: '/admin/freight', title: 'Freight' },
    { path: '/admin/review', title: 'Needs review' },
    { path: '/admin/content', title: 'Photos and text' },
    { path: '/admin/marketplace', title: 'Marketplace' },
  ],
  '/admin/website-data': [
    { path: '/admin/website-data', title: 'Overview', exact: true },
    { path: '/admin/website-data/visitors', title: 'Visitors' },
    { path: '/admin/website-data/opportunities', title: 'Opportunities' },
    { path: '/admin/website-data/titles', title: 'Titles' },
    { path: '/admin/website-data/indexing', title: 'Indexing' },
    { path: '/admin/website-data/health', title: 'Health' },
    { path: '/admin/website-data/shopping', title: 'Shopping' },
    { path: '/admin/website-data/analytics', title: 'Analytics' },
    { path: '/admin/website-data/redirects', title: 'Redirects' },
  ],
};

const ICONS = {
  '/admin': LayoutDashboard,
  '/admin/sales': ShoppingCart,
  '/admin/suppliers': Boxes,
  '/admin/coupons': Ticket,
  '/admin/marketing': Megaphone,
  '/admin/leads': Inbox,
  '/admin/support': Headset,
  '/admin/social': Share2,
  '/admin/website-data': ChartColumn,
  '/admin/resources': FileText,
  '/admin/scout': Radar,
  '/admin/assistant': Sparkles,
  '/admin/ai-connections': Cpu,
  '/admin/connections': Activity,
  '/admin/account': ShieldCheck,
  '/admin/activity': ScrollText,
  '/admin/build-progress': Gauge,
  '/admin/about': Info,
};

// Which headings are rolled up and which sub-menus are open, remembered on this computer only.
const STORE_KEY = 'admin-side-menu';

function loadSaved() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORE_KEY) || '{}');
    return { closedGroups: Array.isArray(saved.closedGroups) ? saved.closedGroups : [], openSubs: Array.isArray(saved.openSubs) ? saved.openSubs : [] };
  } catch {
    return { closedGroups: [], openSubs: [] };
  }
}

function save(state) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // Nothing saved: the menu still works, it just opens as it was.
  }
}

function subActive(item, pathname) {
  if (item.exact) return pathname === item.path;
  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [permissions, setPermissions] = useState(null);
  const [closedGroups, setClosedGroups] = useState([]);
  const [openSubs, setOpenSubs] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // What this person may see: Administrators see everything; a Limited access user only the sections they were given.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/me', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data && data.staff_role === 'operator') setPermissions(data.permissions || {});
      })
      .catch(() => {
        // No answer: the menu stays complete; the backend still refuses what is not allowed.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // On every page: the saved layout, with the current area's heading and sub-menu opened.
  useEffect(() => {
    const saved = loadSaved();
    const current = ADMIN_AREAS.find((area) => isAreaActive(area, pathname));
    const groups = saved.closedGroups.filter((key) => key !== current?.group);
    const subs = current && ADMIN_SUBMENUS[current.href] && !saved.openSubs.includes(current.href) ? [...saved.openSubs, current.href] : saved.openSubs;
    setClosedGroups(groups);
    setOpenSubs(subs);
    setMenuOpen(false);
  }, [pathname]);

  function toggleGroup(key) {
    const next = closedGroups.includes(key) ? closedGroups.filter((k) => k !== key) : [...closedGroups, key];
    setClosedGroups(next);
    save({ closedGroups: next, openSubs });
  }

  function toggleSub(href) {
    const next = openSubs.includes(href) ? openSubs.filter((h) => h !== href) : [...openSubs, href];
    setOpenSubs(next);
    save({ closedGroups, openSubs: next });
  }

  async function handleSignOut() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const visible = ADMIN_AREAS.filter((area) => areaVisible(area.href, permissions) && !(area.href === '/admin/build-progress' && process.env.NEXT_PUBLIC_BUILD_PROGRESS === 'off'));

  return (
    <nav className="admin-sidenav" aria-label="Administration">
      <button type="button" className="admin-sidenav-toggle" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
        {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        Menu
      </button>
      <div className={menuOpen ? 'admin-sidenav-body open' : 'admin-sidenav-body'}>
        {ADMIN_GROUPS.map((group) => {
          const items = visible.filter((area) => area.group === group.key);
          if (!items.length) return null;
          const closed = Boolean(group.name) && closedGroups.includes(group.key);
          return (
            <div key={group.key} className="admin-sidenav-group">
              {group.name && (
                <button type="button" className="admin-sidenav-heading" aria-expanded={!closed} onClick={() => toggleGroup(group.key)}>
                  {group.name}
                  <ChevronDown size={14} aria-hidden="true" className={closed ? 'admin-sidenav-chevron closed' : 'admin-sidenav-chevron'} />
                </button>
              )}
              {!closed && (
                <ul className="admin-sidenav-list">
                  {items.map((area) => {
                    const active = isAreaActive(area, pathname);
                    const subs = ADMIN_SUBMENUS[area.href];
                    const subOpen = Boolean(subs) && openSubs.includes(area.href);
                    const Icon = ICONS[area.href];
                    return (
                      <li key={area.href}>
                        <div className="admin-sidenav-row">
                          <Link href={area.href} className={active ? 'admin-sidenav-link active' : 'admin-sidenav-link'} aria-current={active && !subs ? 'page' : undefined}>
                            {Icon && <Icon size={16} aria-hidden="true" />}
                            <span>{area.label}</span>
                          </Link>
                          {subs && (
                            <button
                              type="button"
                              className="admin-sidenav-caret"
                              aria-expanded={subOpen}
                              aria-label={`${subOpen ? 'Hide' : 'Show'} the ${area.label} pages`}
                              onClick={() => toggleSub(area.href)}
                            >
                              <ChevronDown size={14} aria-hidden="true" className={subOpen ? 'admin-sidenav-chevron' : 'admin-sidenav-chevron closed'} />
                            </button>
                          )}
                        </div>
                        {subOpen && (
                          <ul className="admin-sidenav-sub">
                            {subs.map((item) => {
                              const on = subActive(item, pathname);
                              return (
                                <li key={item.path}>
                                  <Link href={item.path} className={on ? 'active' : undefined} aria-current={on ? 'page' : undefined}>
                                    {item.title}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
        <div className="admin-sidenav-foot">
          <AdminSessionTimer />
          <button type="button" className="admin-nav-signout" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
