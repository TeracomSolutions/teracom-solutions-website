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
import { requireAdminToken } from '@/lib/adminPage';

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
      <h1>Teracom Administration Console</h1>
      <p className="lead">Staff tools for the Teracom Solutions website and store, all served from our own backend. Choose an area.</p>

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
