import { BRAND, retitle } from '@/lib/brand';

import AdminBackups from '@/components/AdminBackups';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: retitle('Backups|Teracom Solutions', BRAND),
};

export default async function AdminBackupsPage() {
  await requireAdminToken();

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Backups <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Backing up everything in the console to the Synology NAS on the office network, on a schedule or now, so that it can all be put back after a failure: every setting and Connection, staff and permissions, the Assistant&apos;s memory, chats and skills, leads, forms, orders, customers, products, the server settings and the uploaded files.</p>

          <h4>Setting it up</h4>
          <ul>
            <li>On the Synology, make a shared folder for backups and a user that may write only there.</li>
            <li>On Connections, Storage, <strong>Backup NAS</strong>: the Synology&apos;s address (10.0.0.10), the shared folder, the user and password, and a backup passphrase of at least 12 characters. Save, then Test.</li>
            <li>Put the passphrase in Zoho Vault. Every backup is locked with it; without it no backup can be opened.</li>
          </ul>

          <h4>How to use it</h4>
          <ul>
            <li><strong>Back up now</strong> makes a backup straight away; the page follows it step by step.</li>
            <li><strong>Schedule</strong>: once a week (default Sunday 2 am) or every day, and how many backups to keep on the NAS. The oldest backup this page made is removed once there are more; nothing else on the NAS is touched.</li>
            <li><strong>Backups</strong>: one line per backup; click it for each file, its size, every step and any error.</li>
          </ul>

          <h4>Things to know</h4>
          <p>A failed backup shows here and on the Backup NAS card, goes on the Audit log and is emailed. The code is on GitHub and is not copied; each backup notes which version was running. How to open a backup and restore it is in the backend&apos;s docs/operations/site-backup.md.</p>
        </AdminHelpIcon>
      </h1>

      <p className="lead">Everything in the console, backed up to the Synology on a schedule and locked with your backup passphrase.</p>

      <AdminBackups />
    </AdminShell>
  );
}
