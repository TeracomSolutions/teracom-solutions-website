import { BRAND, retitle } from '@/lib/brand';

import AdminOwnBusiness from '@/components/AdminOwnBusiness';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminTimeZone from '@/components/AdminTimeZone';
import { fetchTime, fetchZones } from '@/lib/api/adminTime';
import { requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: retitle('Business profile|Teracom Solutions', BRAND),
};

export default async function AdminBusinessProfilePage() {
  const token = await requireAdminToken();
  let timeInfo = null;
  let timeZones = { zones: [], common: [] };
  try {
    [timeInfo, timeZones] = await Promise.all([fetchTime(token), fetchZones(token)]);
  } catch {
    timeInfo = null;
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Business profile <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Who this website belongs to. Everything else reads from here instead of having one business written into the code: emails to customers and staff, the AI&apos;s writing (support chat, the console assistant, the lead finder, articles, service pages and research), the assistant&apos;s and robots&apos; names, the lead finder&apos;s sender details, the time zone and the tax rate.</p>

          <h4>How to use it</h4>
          <ul>
            <li><strong>Business</strong>: the short description finishes the sentence &quot;[name] is …&quot;; what you sell and who your customers are steer the lead finder and articles.</li>
            <li><strong>Email</strong>: staff alerts (sign-in lockouts, website check failures, backups, new forms, risky orders) go to the alert address.</li>
            <li><strong>Tax and money</strong>: the tax rate is used for every ex-tax figure, such as sales ex GST and price list imports.</li>
            <li><strong>Time zone</strong>: sales days, posting slots, business hours and emails all follow it.</li>
          </ul>

          <h4>Things to know</h4>
          <p>Changes apply within a minute. Who may sign in to the console is a security setting kept on the server and is only shown here.</p>
        </AdminHelpIcon>
      </h1>

      <p className="lead">Who this website belongs to: names, contact details, what the business does, branding, time zone and tax.</p>

      <AdminOwnBusiness />

      <section className="bp-time">
        {timeInfo ? (
          <AdminTimeZone initial={timeInfo} zones={timeZones.zones} common={timeZones.common} />
        ) : <p className="form-error" role="alert">Unable to load the time zone setting.</p>}
      </section>
    </AdminShell>
  );
}
