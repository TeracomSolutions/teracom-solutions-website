import { BRAND, retitle } from '@/lib/brand';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminPlatformRules from '@/components/AdminPlatformRules';
import AdminShell from '@/components/AdminShell';
import { requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: retitle('Platform rules|Teracom Solutions', BRAND),
};

export default async function AdminPlatformRulesPage() {
  await requireAdminToken();

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Platform rules <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>One place to see every rule and setting put in place to keep the website safe and cheap to run, so nobody has to remember them: firewall blocks, how Vercel is set up, caching on the website, and checks other Teracom systems make.</p>

          <h4>How to read it</h4>
          <ul>
            <li><strong>Rules</strong>: what is switched on in Vercel now (read live, so it is what is really on), then each setting made on purpose with what it does, why, where it is changed and when.</li>
            <li><strong>Scheduled jobs</strong>: everything that runs by itself on a timetable, from the live website check and supplier price lists to backups and the reminders in Robert&apos;s Claude app, with when it runs and when it last ran.</li>
            <li><strong>Website check</strong>: the latest hourly check of the website, page by page, as a visitor and as a signed-in customer. Press Check now to run it straight away.</li>
          </ul>

          <h4>Things to know</h4>
          <p>Every new setting, scheduled job or reminder is added here as part of the same change that makes it. You can also ask Tera &quot;what rules are in place?&quot; or &quot;why are scrapers blocked?&quot;.</p>
        </AdminHelpIcon>
      </h1>

      <p className="lead">Every rule, setting and scheduled job that keeps the website safe, working and cheap to run.</p>

      <AdminPlatformRules />
    </AdminShell>
  );
}
