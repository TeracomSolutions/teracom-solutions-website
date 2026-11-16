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
            <li><strong>Switched on in Vercel now</strong> is read from Vercel each time you open the page, so it is what is really on, even if someone changed it in Vercel directly. Press Read again to ask Vercel straight away.</li>
            <li><strong>Settings made on purpose</strong> lists each setting with what it does, why it was set, where it is changed and when.</li>
          </ul>

          <h4>Things to know</h4>
          <p>Every new setting of this kind is added to this list as part of the same change. You can also ask Tera &quot;what rules are in place?&quot; or &quot;why are scrapers blocked?&quot;.</p>
        </AdminHelpIcon>
      </h1>

      <p className="lead">Every rule and setting that keeps the website safe and cheap to run, what it does and why.</p>

      <AdminPlatformRules />
    </AdminShell>
  );
}
