import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminAddBusinessForm from '@/components/AdminAddBusinessForm';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminRemoveButton from '@/components/AdminRemoveButton';
import AdminShell from '@/components/AdminShell';
import { fetchManagedBusinesses } from '@/lib/api/adminSuppliers';
import { formatDate } from '@/lib/adminFormat';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Businesses & Suppliers|Teracom Solutions',
};

export default async function AdminSuppliersPage() {
  const token = await requireAdminToken();

  let businesses = [];
  let loadError = null;

  try {
    businesses = await fetchManagedBusinesses(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the businesses from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Businesses &amp; Suppliers
        <AdminHelpIcon>
          <h4>What this section is for</h4>
          <p>The businesses whose product suppliers we track, and for each supplier the price-list files it sends. Three levels: business, then its suppliers, then each supplier&apos;s uploaded files.</p>
          <p>Uploaded files are stored as a record. Nothing reads or imports them automatically yet: the store&apos;s product catalogue is loaded separately, through the <strong>Store Catalog</strong> page.</p>
          <h4>Columns</h4>
          <ul>
            <li><strong>Business</strong> - click it to see its suppliers.</li>
            <li><strong>Website</strong> - opens in a new tab.</li>
            <li><strong>Created</strong> - when it was added.</li>
          </ul>
          <h4>Add / Remove</h4>
          <ul>
            <li>Click <em>Add Business</em> below the table, fill in the name and website URL, then save or cancel.</li>
            <li><em>Remove</em> deletes the business together with its suppliers and their uploaded files, after a confirmation. There is no undo.</li>
            <li>Every add and remove is recorded in the audit log.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Each business, the suppliers whose price lists it receives, and the files uploaded from each supplier.</p>

      {loadError && <p className="form-error" role="alert">{loadError}</p>}

      {!loadError && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Business</th>
                <th>Website</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {businesses.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-muted">No businesses yet.</td>
                </tr>
              )}
              {businesses.map((business) => (
                <tr key={business.id}>
                  <td>
                    <Link href={`/admin/suppliers/${business.id}`} className="admin-link">{business.name}</Link>
                  </td>
                  <td className="wrap">
                    {business.website_url ? (
                      <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="admin-link">
                        {business.website_url}
                      </a>
                    ) : '—'}
                  </td>
                  <td>{formatDate(business.created_at)}</td>
                  <td>
                    <AdminRemoveButton
                      url={`/api/admin/businesses/${business.id}`}
                      confirmText={`Remove ${business.name}, its suppliers and their uploaded files? This cannot be undone.`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminAddBusinessForm />
    </AdminShell>
  );
}
