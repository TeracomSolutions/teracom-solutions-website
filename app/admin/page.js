import { BRAND, retitle } from '@/lib/brand';
import Link from 'next/link';
import {
  Activity,
  Boxes,
  ChartColumn,
  Cpu,
  FileText,
  Gauge,
  Inbox,
  Megaphone,
  Info,
  Radar,
  ScrollText,
  Share2,
  ShoppingCart,
  ShieldCheck,
  Sparkles,
  Headset,
  Ticket,
} from 'lucide-react';

import AdminShell from '@/components/AdminShell';
import TeraPose from '@/components/TeraPose';
import { requireAdminToken } from '@/lib/adminPage';
import { CONSOLE_VERSIONS } from '@/lib/consoleVersions';

export const metadata = {
  title: retitle('Administration|Teracom Solutions', BRAND),
};

// Each area has its own icon and colour so the console reads at a glance,
// on the same black the rest of the site uses.
const AREAS = [
  {
    href: '/admin/account',
    title: 'Account',
    text: 'Your own sign-in: turn two-factor on with an authenticator app or Zoho Vault, and keep your backup codes.',
    icon: ShieldCheck,
    hue: '#f97316',
  },
  {
    href: '/admin/activity',
    title: 'Audit log',
    text: 'Who did what and when: sign-ins, changes made in the console, jobs that ran and system events, with a CSV export.',
    icon: ScrollText,
    hue: '#94a3b8',
  },
  {
    href: '/admin/ai-connections',
    title: 'AI Connections',
    text: 'The providers Scout and the Assistant use — a local Ollama host first, then Anthropic, OpenAI and Groq.',
    icon: Cpu,
    hue: '#2dd4bf',
  },
  {
    href: '/admin/assistant',
    title: 'Assistant',
    text: 'Tell the console what you want in plain English: it looks things up or makes the change, signed as you.',
    icon: Sparkles,
    hue: '#c084fc',
  },
  {
    href: '/admin/connections',
    title: 'Connections',
    text: 'Zoho Books, Cloudflare, Vercel, Stripe and every other outside service, plus our servers and PCs: is each one working, and its keys.',
    icon: Activity,
    hue: '#84cc16',
  },
  {
    href: '/admin/coupons',
    title: 'Coupons',
    text: 'Discount codes the checkout honours: create, limit and switch them off.',
    icon: Ticket,
    hue: '#f472b6',
  },
  {
    href: '/admin/leads',
    title: 'Leads',
    text: 'Enquiries from the contact form on this website, newest first, with Mark contacted.',
    icon: Inbox,
    hue: '#60a5fa',
  },
  {
    href: '/admin/marketing',
    title: 'Marketing',
    text: 'The specials and offers that are on: a banner across the website while they run, and a weekly update to customers and every social network.',
    icon: Megaphone,
    hue: '#f43f5e',
  },
  {
    href: '/admin/resources',
    title: 'Resources',
    text: 'Supplier and manufacturer websites we watch for data sheets and manuals, checked on a schedule and shown on the store.',
    icon: FileText,
    hue: '#fbbf24',
  },
  {
    href: '/admin/sales',
    title: 'Sales',
    text: 'Orders, carts and abandoned carts, with graphs and the detail of every order.',
    icon: ShoppingCart,
    hue: '#4ade80',
  },
  {
    href: '/admin/scout',
    title: 'Scout',
    text: 'Research tasks for the website: run an AI researcher and critic, then approve or reject the report.',
    icon: Radar,
    hue: '#a78bfa',
  },
  {
    href: '/admin/social',
    title: 'Social',
    text: 'LinkedIn, Facebook, Instagram, X and YouTube: the footer links, the accounts we post to, Posting with pictures, video and text per network, the Calendar, and the customers who get updates by email.',
    icon: Share2,
    hue: '#e879f9',
  },
  {
    href: '/admin/support',
    title: 'Support',
    text: 'Ask Tera, the AI support assistant for signed-in customers: what it answers from, the questions it could not answer, and every conversation.',
    icon: Headset,
    hue: '#38bdf8',
  },
  {
    href: '/admin/suppliers',
    title: 'Store',
    text: 'Businesses and their suppliers, the catalogue sheet and the customer price tiers: what the store sells, what it costs and what each tier pays, in one place.',
    icon: Boxes,
    hue: '#fb923c',
  },
  {
    href: '/admin/website-data',
    title: 'Website Data',
    text: 'Who visits the website, from our own records, and how Google shows it: visitors and sources, the searches worth working on, page titles to approve, whether Google has each page, the health of the pages, Google Shopping, Google Analytics, and old shop addresses sent to the right page.',
    icon: ChartColumn,
    hue: '#22d3ee',
  },
  {
    href: '/admin/build-progress',
    title: 'Build progress',
    text: 'Every job being built for the website, how far along it is, the time and tokens it took, and its priority.',
    icon: Gauge,
    hue: '#facc15',
  },
  {
    href: '/admin/about',
    title: 'About',
    text: 'Which versions of the console and the backend are running, and what changed in each.',
    icon: Info,
    hue: '#a3a3a3',
  },
];

// The blocks follow the top menu: same areas, same order (Robert, 2026-10-25).
const VISIBLE_AREAS = AREAS.filter((area) => !(area.href === '/admin/build-progress' && process.env.NEXT_PUBLIC_BUILD_PROGRESS === 'off'));

export default async function AdminHomePage() {
  await requireAdminToken();

  return (
    <AdminShell>
      <div className="admin-overview">
      <section className="admin-overview-hero">
        <svg className="admin-overview-wave" viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="overview-wave-red" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#ff1717" stopOpacity="0.05" />
              <stop offset="0.35" stopColor="#ff1717" stopOpacity="0.85" />
              <stop offset="0.7" stopColor="#ff3b3b" stopOpacity="0.6" />
              <stop offset="1" stopColor="#ff1717" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="overview-wave-grey" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.02" />
              <stop offset="0.5" stopColor="#d4d4d8" stopOpacity="0.35" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <path d="M0 170 C 220 60, 420 60, 600 140 S 980 230, 1200 90 L 1200 130 C 980 260, 760 200, 600 175 S 220 110, 0 210 Z" fill="url(#overview-wave-red)" />
          <path d="M0 190 C 260 110, 440 120, 620 160 S 1000 200, 1200 120" fill="none" stroke="url(#overview-wave-grey)" strokeWidth="10" />
          <path d="M0 150 C 240 40, 460 70, 640 130 S 1010 210, 1200 70" fill="none" stroke="url(#overview-wave-red)" strokeWidth="2" />
          <path d="M0 230 C 300 150, 520 170, 700 190 S 1020 160, 1200 150" fill="none" stroke="url(#overview-wave-red)" strokeWidth="1.5" />
        </svg>
        <div className="admin-overview-hero-text">
          <h1>Teracom Administration Console</h1>
          <p className="lead">Staff tools for the Teracom Solutions website and store, all served from our own backend. Choose an area.</p>
        </div>
        {!BRAND.custom && <TeraPose pose="walking" size={190} className="admin-overview-mascot" />}
      </section>

      <section className="admin-whats-new" aria-label="What's new">
        <h2>What&apos;s new</h2>
        <ul>
          {CONSOLE_VERSIONS.slice(0, 3).map((entry) => (
            <li key={entry.version}>
              <span className="admin-muted">{entry.version} · {entry.date}</span> {entry.notes[0]}
            </li>
          ))}
        </ul>
        <p><Link href="/admin/about">Every change</Link> · <Link href="/admin/where">Where to find everything</Link></p>
      </section>

      <div className="admin-cards">
        {VISIBLE_AREAS.map(({ href, title, text, icon: Icon, hue }) => (
          <Link key={href} href={href} style={{ '--hue': hue }}>
            <span className="admin-card-icon" aria-hidden="true">
              <Icon size={22} strokeWidth={1.8} focusable="false" />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </Link>
        ))}
      </div>
      </div>
    </AdminShell>
  );
}
