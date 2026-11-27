"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSupplierOrdering({ supplierId, initial }) {
  const router = useRouter();

  // State for form fields
  const [zohoVendorName, setZohoVendorName] = useState(initial?.zoho_vendor_name || '');
  const [zohoVendorId, setZohoVendorId] = useState(initial?.zoho_vendor_id || '');
  const [poEmail, setPoEmail] = useState(initial?.po_email || '');
  const [accountNumber, setAccountNumber] = useState(initial?.account_number || '');
  const [dropShip, setDropShip] = useState(initial?.drop_ship || false);
  const [ownPaperwork, setOwnPaperwork] = useState(initial?.own_paperwork || false);
  const [paperworkWording, setPaperworkWording] = useState(initial?.paperwork_wording || '');
  const [autoSendPos, setAutoSendPos] = useState(initial?.auto_send_pos || false);

  const [busy, setBusy] = useState(false);
  const [findText, setFindText] = useState(initial?.name || '');
  const [found, setFound] = useState(null);
  const [finding, setFinding] = useState(false);
  const [findError, setFindError] = useState('');

  // Find in Zoho: search the vendors in Zoho Books and pick one, so nobody has to copy an ID out of Zoho.
  async function findInZoho() {
    setFinding(true);
    setFindError('');
    setFound(null);
    try {
      const res = await fetch(`/api/admin/suppliers/zoho-vendors?q=${encodeURIComponent(findText.trim())}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.detail || 'Zoho Books did not answer.');
      setFound(data.vendors || []);
    } catch (err) {
      setFindError(err.message);
    } finally {
      setFinding(false);
    }
  }

  function pickVendor(vendor) {
    setZohoVendorName(vendor.name);
    setZohoVendorId(vendor.id);
    if (!poEmail && vendor.email) setPoEmail(vendor.email);
    setFound(null);
    setMessage(`${vendor.name} picked. Check the purchase order email, then press Save.`);
  }
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`/api/admin/suppliers/${supplierId}/ordering`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoho_vendor_name: zohoVendorName,
          zoho_vendor_id: zohoVendorId,
          po_email: poEmail,
          account_number: accountNumber,
          drop_ship: dropShip,
          own_paperwork: ownPaperwork,
          paperwork_wording: paperworkWording,
          auto_send_pos: initial?.auto_send_unlocked ? autoSendPos : undefined
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Update form values with response
        setZohoVendorName(data.zoho_vendor_name);
        setZohoVendorId(data.zoho_vendor_id);
        setPoEmail(data.po_email);
        setAccountNumber(data.account_number);
        setDropShip(data.drop_ship);
        setOwnPaperwork(data.own_paperwork);
        setPaperworkWording(data.paperwork_wording);
        setAutoSendPos(data.auto_send_pos);

        setMessage('Saved');
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setBusy(false);
      router.refresh(); // Refresh to update any potential changes
    }
  }

  return (
    <div className="admin-card">
      <h2 className="admin-heading">Ordering details</h2>
      <p className="admin-muted">What we need to send this supplier a purchase order.</p>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="mb-3">
          <label htmlFor="findZohoVendor" className="form-label">Find this supplier in Zoho Books</label>
          <div className="bp-inline">
            <input
              type="text"
              id="findZohoVendor"
              className="form-control"
              value={findText}
              placeholder="Part of the supplier's name in Zoho"
              onChange={(e) => setFindText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); findInZoho(); } }}
            />
            <button type="button" className="btn btn-secondary btn-sm" onClick={findInZoho} disabled={finding || findText.trim().length < 2}>
              {finding ? 'Searching…' : 'Find in Zoho'}
            </button>
          </div>
          {findError && <div className="form-error" role="alert">{findError}</div>}
          {found && found.length === 0 && <div className="admin-muted">No vendor in Zoho matches that name. Try fewer letters, or add the vendor in Zoho Books first.</div>}
          {found && found.length > 0 && (
            <ul className="admin-list">
              {found.map((vendor) => (
                <li key={vendor.id}>
                  <strong>{vendor.name}</strong>
                  {vendor.company && vendor.company !== vendor.name ? ` (${vendor.company})` : ''}
                  {vendor.email ? `, ${vendor.email}` : ''}
                  {!vendor.active ? ' (inactive in Zoho)' : ''}{' '}
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => pickVendor(vendor)}>Use this one</button>
                </li>
              ))}
            </ul>
          )}
          <div className="admin-muted">Fills in the vendor name and ID below (and the email, if it is empty). Press Save afterwards.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="zohoVendorName" className="form-label">Zoho vendor name</label>
          <input
            type="text"
            id="zohoVendorName"
            className="form-control"
            value={zohoVendorName}
            onChange={(e) => setZohoVendorName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="zohoVendorId" className="form-label">Zoho vendor ID</label>
          <input
            type="text"
            id="zohoVendorId"
            className="form-control"
            value={zohoVendorId}
            onChange={(e) => setZohoVendorId(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="poEmail" className="form-label">Purchase order email</label>
          <input
            type="email"
            id="poEmail"
            className="form-control"
            value={poEmail}
            onChange={(e) => setPoEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="accountNumber" className="form-label">Our account number with them</label>
          <input
            type="text"
            id="accountNumber"
            className="form-control"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            id="dropShip"
            className="form-check-input"
            checked={dropShip}
            onChange={(e) => setDropShip(e.target.checked)}
          />
          <label htmlFor="dropShip" className="form-check-label">Drop ship: this supplier ships straight to our customers</label>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            id="ownPaperwork"
            className="form-check-input"
            checked={ownPaperwork}
            onChange={(e) => setOwnPaperwork(e.target.checked)}
          />
          <label htmlFor="ownPaperwork" className="form-check-label">Ship with our paperwork: no distributor paperwork in the parcel</label>
        </div>

        <div className="mb-3">
          <label htmlFor="paperworkWording" className="form-label">Wording for the purchase order</label>
          <textarea
            id="paperworkWording"
            className="form-control"
            rows="3"
            value={paperworkWording}
            onChange={(e) => setPaperworkWording(e.target.value)}
          ></textarea>
          <div className="admin-muted">It is put on the purchase order when the box above is ticked; for example: Please ship direct to the address shown and do not include any distributor invoice, delivery docket, price list or paperwork in the parcel; our paperwork travels with the goods.</div>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            id="autoSendPos"
            className="form-check-input"
            checked={autoSendPos}
            onChange={(e) => setAutoSendPos(e.target.checked)}
            disabled={!initial?.auto_send_unlocked}
          />
          <label htmlFor="autoSendPos" className="form-check-label">Send purchase orders automatically</label>
          {!initial?.auto_send_unlocked && (
            <div className="admin-muted">Locked</div>
          )}
        </div>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="admin-muted">
            {message}
          </div>
        )}

        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}