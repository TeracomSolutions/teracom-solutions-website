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
    text: 'The businesses whose suppliers we track, each supplier, and the price-list files it sends.',
  },
  {
    href: '/admin/leads',
    title: 'Leads',
    text: 'Enquiries from the contact form on this website, newest first, with Mark contacted.',
  },
  {
    href: '/admin/scout',
    title: 'Scout',
    text: 'Research tasks for the website and for Operating System packs: run an AI researcher and critic, then approve or reject the report.',
  },
  {
    href: '/admin/ai-connections',
    title: 'AI Connections',
    text: 'The providers Scout researches with — a local Ollama host first, then Anthropic, OpenAI and Groq as fallbacks.',
  },
  {
    href: '/admin/catalog',
    title: 'Store Catalog',
    text: 'Import a supplier price-list feed to update product pricing and stock in the store.',
  },
  {
    href: '/admin/coupons',
    title: 'Coupons',
    text: 'Discount codes the checkout honours: create, limit and switch them off.',
  },
];

export default async function AdminHomePage() {
  await requireAdminToken();

  return (
    <AdminShell>
      <h1>Teracom Administration Console</h1>
      <p className="lead">Staff tools for the Teracom Solutions website and store. Choose an area.</p>

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
