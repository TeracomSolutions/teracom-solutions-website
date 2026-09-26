import Link from 'next/link';

import AdminShell from '@/components/AdminShell';
import { requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Administration|Teracom Solutions',
};

const AREAS = [
  {
    href: '/admin/suppliers',
    title: 'Businesses & Suppliers',
    text: 'The businesses whose suppliers we track, each supplier, the price lists it sends, and Import into store.',
  },
  {
    href: '/admin/catalog',
    title: 'Store Catalog',
    text: 'Every product in the store catalogue, with a paste-in feed import for one-offs.',
  },
  {
    href: '/admin/pricing',
    title: 'Pricing',
    text: 'Silver, Gold and Platinum discounts off RRP, per-supplier overrides, and the whole price list at every tier.',
  },
  {
    href: '/admin/coupons',
    title: 'Coupons',
    text: 'Discount codes the checkout honours: create, limit and switch them off.',
  },
  {
    href: '/admin/leads',
    title: 'Leads',
    text: 'Enquiries from the contact form on this website, newest first, with Mark contacted.',
  },
  {
    href: '/admin/scout',
    title: 'Scout',
    text: 'Research tasks for the website: run an AI researcher and critic, then approve or reject the report.',
  },
  {
    href: '/admin/ai-connections',
    title: 'AI Connections',
    text: 'The providers Scout researches with — a local Ollama host first, then Anthropic, OpenAI and Groq as fallbacks.',
  },
];

export default async function AdminHomePage() {
  await requireAdminToken();

  return (
    <AdminShell>
      <h1>Teracom Administration Console</h1>
      <p className="lead">Staff tools for the Teracom Solutions website and store, all served from our own backend. Choose an area.</p>

      <div className="admin-cards">
        {AREAS.map((area) => (
          <Link key={area.href} href={area.href}>
            <h3>{area.title}</h3>
            <p>{area.text}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
