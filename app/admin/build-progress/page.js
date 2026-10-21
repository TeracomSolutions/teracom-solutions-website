import { redirect } from 'next/navigation';

import AdminBuildProgress from '@/components/AdminBuildProgress';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { fetchBuildProgress } from '@/lib/api/adminBuildProgress';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Build progress|Teracom Solutions',
};

export default async function AdminBuildProgressPage() {
  const token = await requireAdminToken();

  let data = null;
  try {
    data = await fetchBuildProgress(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    data = null;
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Build progress
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Where each coding job stands, and how the coding factory is doing, without asking anyone. It refreshes itself every minute.</p>
          <h4>The five steps</h4>
          <ul>
            <li><strong>Planned</strong>: nothing started.</li>
            <li><strong>Being built</strong>: a coding task is running or waiting, or a branch has work and no pull request yet.</li>
            <li><strong>In tests</strong>: a pull request is open and its checks are running.</li>
            <li><strong>Merged</strong>: the pull request is merged but not yet confirmed running.</li>
            <li><strong>Live</strong>: merged and running on the live site.</li>
          </ul>
          <h4>Where the facts come from</h4>
          <p>A script on VM 400 reports the queue, the GPU and the session notes every ten minutes, and the website server asks GitHub about each pull request. The stage is worked out from those facts, never typed in. A warning appears when information is older than 30 minutes, which usually means a collector has stopped.</p>
          <h4>Percent complete</h4>
          <p>For a running job the percentage is an estimate from how long similar jobs take, so treat it as a guide. Time and tokens are the real figures.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Where each build item stands, and how the coding factory is doing.</p>
      <AdminBuildProgress initial={data} />
    </AdminShell>
  );
}
