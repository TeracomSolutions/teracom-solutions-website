import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminResourceSources from '@/components/AdminResourceSources';
import AdminShell from '@/components/AdminShell';
import { fetchSupplierPricing } from '@/lib/api/adminPricing';
import { fetchResourceSources } from '@/lib/api/adminResources';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Resources|Teracom Solutions',
};

export default async function AdminResourcesPage() {
  const token = await requireAdminToken();

  let sources = [];
  let suppliers = [];
  let loadError = '';

  try {
    [sources, suppliers] = await Promise.all([fetchResourceSources(token), fetchSupplierPricing(token)]);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load Resources from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Resources
        <AdminHelpIcon>
          <h4>What this section is for</h4>
          <p>Point it at a supplier&apos;s or manufacturer&apos;s downloads page and it collects the PDFs there -- data sheets, user manuals, installer manuals, brochures -- keeps a copy on our server, and shows them on the matching product page in the store. On the schedule you choose it goes back, notices anything new or changed, and brings it in.</p>
          <h4>Adding a website</h4>
          <ul>
            <li><strong>Page to watch</strong> - the downloads or support page. Tick <em>Also look at pages on the same site</em> when the files sit one click deeper (a product page per model, say); it follows up to 20 same-site links.</li>
            <li><strong>Collect</strong> - which kinds of document to keep. A file is classified from its link text and name (install → installer manual, datasheet/spec → data sheet, manual/guide → user manual, brochure → brochure).</li>
            <li><strong>Check</strong> - how often to revisit. The scheduler on the server runs every 15 minutes and starts any check that is due; <em>Check now</em> runs one immediately.</li>
          </ul>
          <h4>The table</h4>
          <ul>
            <li><strong>Result</strong> - the last check: how many files were found, how many were new, how many had changed since last time. A failed check shows why.</li>
            <li><strong>Documents</strong> - click the website name to see them, set the store SKU each belongs to, publish or hide them.</li>
            <li><strong>Pause</strong> keeps the documents but stops the schedule; <strong>Remove</strong> deletes the website and every file collected from it.</li>
          </ul>
          <h4>Getting them onto the store</h4>
          <p>A document appears in the Downloads section of a product page when it is published and its <strong>Store SKU</strong> matches the product&apos;s part number. The SKU is filled in automatically when the file name contains a SKU that is in the store catalogue; otherwise set it on the documents page.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Supplier and manufacturer websites we watch for data sheets and manuals, checked on a schedule and shown on the store.</p>

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : (
        <AdminResourceSources sources={sources} suppliers={suppliers} />
      )}
    </AdminShell>
  );
}
