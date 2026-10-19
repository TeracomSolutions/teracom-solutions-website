import Link from 'next/link';

import { tiles, recentTiles, statusBars, poRows } from '../lib/orderDashboardView.js';
import { cents } from '../lib/orderView.js';

export default function AdminOrderDashboard({ dashboard }) {
  if (!dashboard) return null;

  return (
    <div className='order-dash'>
      <h2>Order dashboard</h2>
      <p className='admin-muted'>Live orders only. Click a tile to see those orders.</p>

      <div className='admin-stats'>
        {tiles(dashboard.stages).map((tile) => (
          <Link key={tile.key} href={tile.href} className={'admin-stat order-dash-tile is-' + tile.tone}>
            <span className='admin-stat-label'>{tile.label}</span>
            <span className='admin-stat-value'>{tile.count}</span>
          </Link>
        ))}
        {tiles(dashboard.extra).map((tile) => (
          <Link key={tile.key} href={tile.href} className={'admin-stat order-dash-tile is-' + tile.tone}>
            <span className='admin-stat-label'>{tile.label}</span>
            <span className='admin-stat-value'>{tile.count}</span>
          </Link>
        ))}
      </div>

      <div className='admin-stats'>
        {recentTiles(dashboard.recent).map((tile) => (
          <div key={tile.key} className='admin-stat'>
            <span className='admin-stat-label'>{tile.label}</span>
            <span className='admin-stat-value'>{tile.value}</span>
          </div>
        ))}
        <div className='admin-stat'>
          <span className='admin-stat-label'>Units waiting on a supplier</span>
          <span className='admin-stat-value'>{dashboard.units_awaiting_supplier || 0}</span>
        </div>
      </div>

      <section className='admin-card'>
        <h3>Orders by status</h3>
        {statusBars(dashboard.status_breakdown).length === 0 ? (
          <p className='admin-muted'>No orders yet.</p>
        ) : (
          <ul className='order-dash-bars'>
            {statusBars(dashboard.status_breakdown).map((bar) => (
              <li key={bar.status}>
                {bar.label} <span className='admin-muted'>({bar.count})</span>
                <div className='order-dash-bar'>
                  <div className='order-dash-fill' style={{ width: bar.percent + '%' }}></div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className='admin-card'>
        <h3>Supplier purchase orders</h3>
        <ul>
          {poRows(dashboard.purchase_orders).map((row) => (
            <li key={row.key}>
              {row.label}: {row.count !== null ? row.count : <span className='admin-muted'>{row.note}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className='admin-card'>
        <h3>Top sellers (last 30 days)</h3>
        {dashboard.top_sellers && dashboard.top_sellers.length > 0 ? (
          <ul>
            {dashboard.top_sellers.map((item) => (
              <li key={item.sku}>
                {item.name} x {item.units}
              </li>
            ))}
          </ul>
        ) : (
          <p className='admin-muted'>No sales yet.</p>
        )}
      </section>

      <section className='admin-card'>
        <h3>Low stock</h3>
        <p>Products on the shop with 5 or fewer in stock.</p>
        {dashboard.low_stock && dashboard.low_stock.length > 0 ? (
          <ul>
            {dashboard.low_stock.map((item) => (
              <li key={item.sku}>
                {item.sku} {item.name} ({item.stock})
              </li>
            ))}
          </ul>
        ) : (
          <p className='admin-muted'>Nothing is low.</p>
        )}
      </section>

      {dashboard.not_tracked && dashboard.not_tracked.length > 0 && (
        <section className='admin-card'>
          <h3>Not tracked yet</h3>
          <ul>
            {dashboard.not_tracked.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}