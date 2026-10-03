import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminAddSupplierForm from '@/components/AdminAddSupplierForm';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminRemoveButton from '@/components/AdminRemoveButton';
import AdminShell from '@/components/AdminShell';
import AdminStoreTabs from '@/components/AdminStoreTabs';
import { fetchAllSuppliers } from '@/lib/api/adminSuppliers';
import { formatDateTime, humanise } from '@/lib/adminFormat';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Data Feeds|Teracom Solutions',
};

// Store opens on Data Feeds (Robert, 2026-10-03): the suppliers whose
// price lists and feeds fill the store. There is one website, so there is
// no list of businesses to pick from first.
export default async function AdminDataFeedsPage() {
  const token = await requireAdminToken();

  let suppliers = [];
  let loadError = null;

  try {
    suppliers = await fetchAllSuppliers(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the suppliers from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Data Feeds
        <AdminHelpIcon>
          <p>The suppliers whose price lists fill the store. Open one to add a direct link or automatic feed, upload a file by hand, and choose which brands to import.</p>
          <h4>Columns</h4>
          <ul>
            <li><strong>Supplier</strong> - click it for its feeds, uploads and brands.</li>
            <li><strong>Type</strong> - Distributor (sells many brands) or Manufacturer (makes its own).</li>
            <li><strong>Brands</strong> - how many brands its imports keep to; Not chosen until the first import.</li>
            <li><strong>Last import</strong> - when one of its price lists was last imported into the store.</li>
          </ul>
          <h4>Add / Remove</h4>
          <ul>
            <li>Add Supplier: enter the name and choose the type.</li>
            <li>Remove deletes the supplier and its uploaded files, after a confirmation. Products already in the store stay there.</li>
            <li>Every add and remove is recorded in the audit log.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <AdminStoreTabs />
      <p className="lead">The suppliers whose price lists and feeds fill the store. Open one to set up its feed and choose its brands.</p>

      {loadError && <p className="form-error" role="alert">{loadError}</p>}

      {!loadError && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Type</th>
                <th>Brands</th>
                <th>Last import</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={5} className="admin-muted">No suppliers yet. Add one below.</td>
                </tr>
              )}
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>
                    <Link href={`/admin/suppliers/${supplier.id}`} className="admin-link">
                      {supplier.name}
                    </Link>
                  </td>
                  <td>
                    <span className={`admin-status ${supplier.supplier_type === 'manufacturer' ? 'is-approved' : 'is-pending'}`}>
                      {humanise(supplier.supplier_type)}
                    </span>
                  </td>
                  <td>
                    {supplier.brand_filter && supplier.brand_filter.length > 0
                      ? `${supplier.brand_filter.length} brand${supplier.brand_filter.length === 1 ? '' : 's'}`
                      : <span className="admin-muted">Not chosen</span>}
                  </td>
                  <td>{supplier.last_import_at ? formatDateTime(supplier.last_import_at) : <span className="admin-muted">Never</span>}</td>
                  <td>
                    <AdminRemoveButton
                      url={`/api/admin/suppliers/${supplier.id}`}
                      confirmText={`Remove ${supplier.name} and its uploaded files? This cannot be undone.`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminAddSupplierForm />
    </AdminShell>
  );
}