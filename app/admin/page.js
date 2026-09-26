import Link from 'next/link';
import {
  Boxes,
  ChartColumn,
  Cpu,
  FileText,
  Inbox,
  Radar,
  Sparkles,
  Ticket,
} from 'lucide-react';

import AdminShell from '@/components/AdminShell';
import { requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Administration|Teracom Solutions',
};

// Each area has its own icon and colour so the console reads at a glance,
// on the same black the rest of the site uses.
const AREAS = [
  {
    href: '/admin/assistant',
    title: 'Assistant',
    text: 'Tell the console what you want in plain English: it looks things up or makes the change, signed as you.',
    icon: Sparkles,
    hue: '#c084fc',
  },
  {
    href: '/admin/suppliers',
    title: 'Store',
    text: 'Businesses and their suppliers, the catalogue sheet and the customer price tiers: what the store sells, what it costs and what each tier pays, in one place.',
    icon: Boxes,
    hue: '#fb923c',
  },
  {
    href: '/admin/coupons',
    title: 'Coupons',
    text: 'Discount codes the checkout honours: create, limit and switch them off.',
    icon: Ticket,
    hue: '#f472b6',
  },
  {
    href: '/admin/resources',
    title: 'Resources',
    text: 'Supplier and manufacturer websites we watch for data sheets and manuals, checked on a schedule and shown on the store.',
    icon: FileText,
    hue: '#fbbf24',
  },
  {
    href: '/admin/leads',
    title: 'Leads',
    text: 'Enquiries from the contact form on this website, newest first, with Mark contacted.',
    icon: Inbox,
    hue: '#60a5fa',
  },
  {
    href: '/admin/website-data',
    title: 'Website Data',
    text: 'Visitors, page views, top pages, sources, countries and devices for the public website, from our own records.',
    icon: ChartColumn,
    hue: '#22d3ee',
  },
  {
    href: '/admin/scout',
    title: 'Scout',
    text: 'Research tasks for the website: run an AI researcher and critic, then approve or reject the report.',
    icon: Radar,
    hue: '#a78bfa',
  },
  {
    href: '/admin/ai-connections',
    title: 'AI Connections',
    text: 'The providers Scout and the Assistant use — a local Ollama host first, then Anthropic, OpenAI and Groq.',
    icon: Cpu,
    hue: '#2dd4bf',
  },
];

export default async function AdminHomePage() {
  await requireAdminToken();

  return (
    <AdminShell>
      <h1>Teracom Administration Console</h1>
      <p className="lead">Staff tools for the Teracom Solutions website and store, all served from our own backend. Choose an area.</p>

      <div className="admin-cards">
        {AREAS.map(({ href, title, text, icon: Icon, hue }) => (
          <Link key={href} href={href} style={{ '--hue': hue }}>
            <span className="admin-card-icon" aria-hidden="true">
              <Icon size={22} strokeWidth={1.8} focusable="false" />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
