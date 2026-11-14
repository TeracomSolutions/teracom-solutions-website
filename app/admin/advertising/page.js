import { BRAND, retitle } from '@/lib/brand';
import { redirect } from 'next/navigation';

import AdminAdvertising from '@/components/AdminAdvertising';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { fetchAdvertising } from '@/lib/api/adminAdvertising';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: retitle('Advertising|Teracom Solutions', BRAND),
};

export default async function AdminAdvertisingPage() {
  const token = await requireAdminToken();
  let data = null;
  try {
    data = await fetchAdvertising(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Advertising <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Paid ads on Google, Facebook and Instagram, eBay, Pinterest, TikTok, LinkedIn, Snapchat, Reddit and anywhere else you pay to promote the business, made and watched from one place.</p>

          <h4>How a campaign goes live</h4>
          <ul>
            <li>New campaign: choose the platform and the products, set the daily budget and save the draft.</li>
            <li>Write the text: the AI writes the ad from the products. Read it and change anything.</li>
            <li>Send (switched off): the campaign is made on the platform but does not run or spend. Check it there if you like.</li>
            <li>Go live: switches it on. Only works when the mode on the Rules tab is live and the month&apos;s limits leave room.</li>
          </ul>

          <h4>Spend safety</h4>
          <p>Set a monthly limit for all advertising (and for each platform if you like) on the Rules tab; nothing goes live without one. Every hour the spend is read from each platform and campaigns are paused when a limit is reached, a product runs out or drops below cost, or sales cost too much. The checks only pause; switching on and raising a budget always take a person.</p>

          <h4>Platforms without a connector</h4>
          <p>Microsoft Advertising, Amazon, X, Gumtree, marketplaces, trade directories and anything else: make a campaign for it and record its spend and results by hand, so every dollar shows in Results.</p>

          <h4>Keys</h4>
          <p>Each platform&apos;s keys are added on Connections, in the Advertising group. Billing stays in each platform&apos;s own account; the website never holds card details.</p>
        </AdminHelpIcon>
      </h1>

      <p className="lead">
        Make ads from the store&apos;s products, put them live on each platform inside your monthly limits, and see what they cost and sell.
      </p>

      {data ? <AdminAdvertising initial={data} /> : <p className="form-error" role="alert">Unable to load Advertising from the backend.</p>}
    </AdminShell>
  );
}
