import { redirect } from 'next/navigation';

import AdminFeedback from '@/components/AdminFeedback';
import AdminMarketing from '@/components/AdminMarketing';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { fetchFeedback, fetchMarketing } from '@/lib/api/adminMarketing';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { BRAND, retitle } from '@/lib/brand';

export const metadata = {
  title: retitle('Marketing|Teracom Solutions', BRAND),
};

export default async function AdminMarketingPage() {
  const token = await requireAdminToken();
  let data = null;
  try {
    data = await fetchMarketing(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
  }
  let feedback = null;
  try {
    feedback = await fetchFeedback(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
  }
  return (
    <AdminShell>
      <h1 className="admin-heading">
        Marketing
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Specials (campaigns): the offer, a short banner line for the website with a link and coupon, start and end days, and whether it shows in the website banner and goes in the weekly specials update. <strong>On the website now</strong> shows what the banner says at this moment.</p>
          <h4>The weekly specials update</h4>
          <p>Once a week the live specials are written into one update in Social &gt; Posting: sent automatically, or left as a draft to check, on the day, hour and channels set here. Emails only go to customers who agreed to marketing email.</p>
          <h4>Customer feedback</h4>
          <p>After paying, customers are asked how likely they are to recommend us (0 to 10) and offered a Google review. The Customer feedback section shows the last 90 days: the recommend score, the answers and how many went on to review. Paste the Google review link there to show the review button.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">The specials and offers that are on: shown in a banner across the website while they run, and sent once a week to customers and every social network.</p>
      {data ? <AdminMarketing initial={data} /> : <p className="form-error" role="alert">Unable to load the campaigns from the backend.</p>}
      <AdminFeedback initial={feedback} />
    </AdminShell>
  );
}
