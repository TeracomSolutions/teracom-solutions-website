import { BRAND, retitle } from '@/lib/brand';
import { redirect } from 'next/navigation';

import AdminMemory from '@/components/AdminMemory';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: retitle('Memory|Teracom Solutions', BRAND),
};

export default async function AdminMemoryPage() {
  await requireAdminToken();

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Memory <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>What the console Assistant and Ask Tera keep in the website&apos;s database, so you can see that memory is being saved, how fast it grows, and how quickly they answer.</p>

          <h4>How to read it</h4>
          <ul>
            <li>Storage: how many entries are kept and how much space they take. Content is the text itself; indexes and database overhead is what the database adds to find entries quickly.</li>
            <li>Growth: entries added today, this week and this month, and the line of total entries over the last 30 days.</li>
            <li>How quickly they answer: the average, middle (median) and slowest answer time for the Assistant and Ask Tera. Only answers that worked are timed.</li>
          </ul>

          <h4>Things to know</h4>
          <p>Assistant memory notes can be read and deleted on the Assistant page. Ask Tera&apos;s library is rebuilt from the website&apos;s pages and documents. Times are Melbourne time.</p>
        </AdminHelpIcon>
      </h1>

      <p className="lead">
        What the Assistant and Ask Tera remember, how fast it grows and how quickly they answer.
      </p>

      <AdminMemory />
    </AdminShell>
  );
}
