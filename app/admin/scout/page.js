import AdminShell from '@/components/AdminShell';
import AdminScoutTabs from '@/components/AdminScoutTabs';
import { requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Scout|Teracom Solutions',
};

// The tabs themselves load their data in the browser, so this page only
// checks the session and passes the requested tab along.
export default async function AdminScoutPage({ searchParams }) {
  await requireAdminToken();
  const { tab } = await searchParams;

  return (
    <AdminShell>
      <AdminScoutTabs initialTab={tab} />
    </AdminShell>
  );
}
