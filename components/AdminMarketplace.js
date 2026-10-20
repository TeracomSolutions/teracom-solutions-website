"use client";

import { useState } from 'react';
import MarketplaceSearch from './MarketplaceSearch.js';
import MarketplaceDrafts from './MarketplaceDrafts.js';
import MarketplaceOrders from './MarketplaceOrders.js';
import { statusSentences } from '../lib/marketplaceView.js';

export default function AdminMarketplace({ status }) {
  const [refreshKey, setRefreshKey] = useState(0);

  if (!status) {
    return (
      <div className="order-dash">
        <p className="form-error" role="alert">Unable to load the marketplace settings.</p>
      </div>
    );
  }

  return (
    <div className="order-dash">
      <section className="admin-card">
        <h2>Connections</h2>
        <ul>
          {statusSentences(status).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>
      <MarketplaceSearch status={status} onImported={() => setRefreshKey(refreshKey + 1)} />
      <MarketplaceDrafts refreshKey={refreshKey} />
      <MarketplaceOrders status={status} />
    </div>
  );
}
