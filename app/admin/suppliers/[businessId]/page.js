import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminAddSupplierForm from '@/components/AdminAddSupplierForm';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminRemoveButton from '@/components/AdminRemoveButton';
import AdminShell from '@/components/AdminShell';
import { fetchSuppliersForBusiness, findBusinessName } from '@/lib/api/adminSuppliers';
import { formatDate, humanise } from '@/lib/adminFormat';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Suppliers|Teracom Solutions',
};

export default async function AdminBusinessSuppliersPage({ params }) {
  const token = await requireAdminToken();
  const { businessId } = await params;

  let suppliers = [];
  let loadError = null;
  const businessName = await findBusinessName(token, businessId);

  try {
    suppliers = await fetchSuppliersForBusiness(token, businessId);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the suppliers for this business.';
  }

  return (
    <AdminShell>
      <p className="admin-muted"><Link href="/admin/suppliers" className="admin-link">&larr; Businesses &amp; Suppliers</Link></p>
      <h1 className="admin-heading">
        {businessName ? `${businessName} — Suppliers` : 'Suppliers'}
        <AdminHelpIcon>
          <p>The product suppliers this business buys from, whose price-list files it receives. Click a supplier to upload its files and see what has been uploaded.</p>
          <h4>Suppliers</h4>
          <ul>
            <li><strong>Name</strong> - click it for its uploads.</li>
            <li><strong>Type</strong> - Manufacturer (makes the products) or Distributor (resells them).</li>
            <li><strong>Created</strong> - when it was added.</li>
          </ul>
          <h4>Add / Remove</h4>
          <ul>
            <li>Enter the supplier name and choose its type, then save.</li>
            <li><em>Remove</em> deletes the supplier and its uploaded files, after a confirmation. There is no undo.</li>
            <li>Every add and remove is recorded in the audit log.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Manage the suppliers associated with this business.</p>

      {loadError && <p className="form-error" role="alert">{loadError}</p>}

      {!loadError && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-muted">No suppliers yet.</td>
                </tr>
              )}
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>
                    <Link href={`/admin/suppliers/${businessId}/${supplier.id}`} className="admin-link">
                      {supplier.name}
                    </Link>
                  </td>
                  <td>
                    <span className={`admin-status ${supplier.supplier_type === 'manufacturer' ? 'is-approved' : 'is-pending'}`}>
                      {humanise(supplier.supplier_type)}
                    </span>
                  </td>
                  <td>{formatDate(supplier.created_at)}</td>
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

      <AdminAddSupplierForm businessId={businessId} />
    </AdminShell>
  );
}
