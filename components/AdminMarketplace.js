"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MarketplaceSettings from './MarketplaceSettings.js';
import MarketplaceSuppliers from './MarketplaceSuppliers.js';
import MarketplaceSearch from './MarketplaceSearch.js';
import MarketplaceImport from './MarketplaceImport.js';
import MarketplaceDrafts from './MarketplaceDrafts.js';
import MarketplaceOrders from './MarketplaceOrders.js';
import { marketplaceRequest } from '../lib/marketplaceClient.js';
import { findConnection, searchableSuppliers } from '../lib/marketplaceView.js';

export default function AdminMarketplace({ initial }) {
  const router = useRouter();
  const initialStatus = initial && initial.status ? initial.status : null;
  const initialSuppliers = (initial && initial.suppliers) || [];
  const initialConnections = (initial && initial.connections) || [];

  const firstSearchable = searchableSuppliers(initialSuppliers);
  const defaultSelected = firstSearchable.length
    ? firstSearchable[0].name
    : (initialSuppliers.length ? initialSuppliers[0].name : '');

  const [status, setStatus] = useState(initialStatus);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [connections, setConnections] = useState(initialConnections);
  const [selected, setSelected] = useState(defaultSelected);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');

  function reload() {
    setError('');
    Promise.all([
      marketplaceRequest('status'),
      marketplaceRequest('suppliers'),
      fetch('/api/admin/connections').then((r) => r.json()),
    ]).then(([statusData, suppliersData, connectionsData]) => {
      const failed = [statusData, suppliersData, connectionsData].some((d) => !d || (d && d.error));
      if (statusData && statusData.mode !== undefined) {
        setStatus(statusData);
      }
      if (suppliersData && suppliersData.suppliers) {
        setSuppliers(suppliersData.suppliers);
      }
      if (Array.isArray(connectionsData)) {
        setConnections(connectionsData.filter((c) => c.key === 'marketplace' || (c.key && c.key.startsWith('mp_'))));
      }
      if (failed) {
        setError('Some of this page could not be refreshed.');
      }
      router.refresh();
    }).catch(() => {
      setError('Some of this page could not be refreshed.');
      router.refresh();
    });
  }

  const defaultMarkup = status && status.settings ? status.settings.default_markup : 40;
  const selectedSupplier = suppliers.find((item) => item.name === selected) || null;

  return (
    <div className="order-dash">
      {(error || !status) ? (
        <p className="form-error" role="alert">{!status ? 'Unable to load all of the marketplace settings.' : error}</p>
      ) : null}
      <MarketplaceSettings status={status} connection={findConnection(connections, 'marketplace')} onChanged={reload} />
      <MarketplaceSuppliers suppliers={suppliers} connections={connections} selected={selected} onSelect={setSelected} onChanged={reload} />
      <MarketplaceSearch status={status} suppliers={suppliers} selected={selected} defaultMarkup={defaultMarkup} onImported={() => setRefreshKey(refreshKey + 1)} />
      <MarketplaceImport supplier={selectedSupplier} status={status} onImported={() => setRefreshKey(refreshKey + 1)} />
      <MarketplaceDrafts refreshKey={refreshKey} />
      <MarketplaceOrders status={status} />
    </div>
  );
}
