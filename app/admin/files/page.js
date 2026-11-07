import { BRAND, retitle } from '@/lib/brand';
import { redirect } from 'next/navigation';

import AdminFiles from '@/components/AdminFiles';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { fetchFileRoots } from '@/lib/api/adminFiles';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: retitle('Files|Teracom Solutions', BRAND),
};

export default async function AdminFilesPage() {
  const token = await requireAdminToken();

  let roots = [];
  let loadError = '';

  try {
    roots = (await fetchFileRoots(token)).roots || [];
  } catch (err) {
    if (isSessionError(err)) {
      redirect('/admin/login');
    } else {
      loadError = 'Unable to load the files from the backend.';
    }
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Files <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>
            A read-only view of the files on the live server, so you can see where the
            pictures, backgrounds, Tera poses and code are without signing in with SSH or WinSCP.
          </p>

          <h4>How to use it</h4>
          <ul>
            <li>Pick a place on the left, then click folders to go in. The path above the list shows where you are.</li>
            <li>Click a picture or text file to preview it. Download saves a copy to this computer.</li>
          </ul>

          <h4>Things to know</h4>
          <p>
            Nothing here can be changed or deleted. Passwords, keys, .env files, settings,
            database files and the installed packages are never shown.
          </p>
        </AdminHelpIcon>
      </h1>

      <p className="lead">
        Browse the live website and backend folders, the graphics library and uploaded files. Look, preview and download only.
      </p>

      {loadError ? (
        <p className="form-error" role="alert">
          {loadError}
        </p>
      ) : (
        <AdminFiles roots={roots} />
      )}
    </AdminShell>
  );
}
