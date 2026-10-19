'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminBars from '@/components/AdminBars';
import { PRESETS, COMPARISONS, dollars, kpiCards, seriesForBars, toCsv, summaryQuery } from '@/lib/salesView';
import { formatDateTime } from '@/lib/adminFormat';

export default function AdminSalesDashboard() {
  const [range, setRange] = useState('30d');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [compare, setCompare] = useState('previous');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState({ total: 0, orders: [] });
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  // Load summary and orders
  const loadSummaryAndOrders = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // Load summary
      const summaryResponse = await fetch('/api/admin/sales/summary' + summaryQuery({ range, start, end, compare }));
      const summaryData = await summaryResponse.json();

      if (!summaryResponse.ok) {
        throw new Error(summaryData.error || 'The sales numbers could not be loaded.');
      }

      setSummary(summaryData);

      // Load orders
      const limit = 50;
      const skip = (page - 1) * limit;
      const ordersResponse = await fetch(`/api/admin/sales/orders?range=${range}&start=${start}&end=${end}&q=${encodeURIComponent(q)}&skip=${skip}&limit=${limit}`);
      const ordersData = await ordersResponse.json();

      if (!ordersResponse.ok) {
        throw new Error(ordersData.error || 'The sales orders could not be loaded.');
      }

      setOrders(ordersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [range, start, end, compare, page, q]);

  useEffect(() => {
    loadSummaryAndOrders();
  }, [loadSummaryAndOrders]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'range') {
      setRange(value);
      // Reset start and end when range changes to custom
      if (value !== 'custom') {
        setStart('');
        setEnd('');
      }
    } else {
      const setter = name === 'start' ? setStart : setEnd;
      setter(value);
    }
  };

  const handleCompareChange = (e) => {
    setCompare(e.target.value);
  };

  const handleShowClick = () => {
    // When showing custom dates, trigger reload
    loadSummaryAndOrders();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on search
    loadSummaryAndOrders();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Download CSV function
  const downloadCsv = (csvData, filename) => {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate CSV for top products
  const generateTopProductsCsv = () => {
    if (!summary || !summary.top || !summary.top.product) return '';

    const headers = ['Name', 'Items sold', 'Sales ex GST', 'Margin ex GST'];
    const rows = summary.top.product.map(item => [
      item.label,
      item.units,
      dollars(item.revenue_ex_cents),
      dollars(item.margin_cents)
    ]);

    return toCsv(headers, rows);
  };

  // Generate CSV for top brands
  const generateTopBrandsCsv = () => {
    if (!summary || !summary.top || !summary.top.brand) return '';

    const headers = ['Name', 'Items sold', 'Sales ex GST', 'Margin ex GST'];
    const rows = summary.top.brand.map(item => [
      item.label,
      item.units,
      dollars(item.revenue_ex_cents),
      dollars(item.margin_cents)
    ]);

    return toCsv(headers, rows);
  };

  // Generate CSV for top categories
  const generateTopCategoriesCsv = () => {
    if (!summary || !summary.top || !summary.top.category) return '';

    const headers = ['Name', 'Items sold', 'Sales ex GST', 'Margin ex GST'];
    const rows = summary.top.category.map(item => [
      item.label,
      item.units,
      dollars(item.revenue_ex_cents),
      dollars(item.margin_cents)
    ]);

    return toCsv(headers, rows);
  };

  // Generate CSV for top suppliers
  const generateTopSuppliersCsv = () => {
    if (!summary || !summary.top || !summary.top.supplier) return '';

    const headers = ['Name', 'Items sold', 'Sales ex GST', 'Margin ex GST'];
    const rows = summary.top.supplier.map(item => [
      item.label,
      item.units,
      dollars(item.revenue_ex_cents),
      dollars(item.margin_cents)
    ]);

    return toCsv(headers, rows);
  };

  // Generate CSV for breakdowns
  const generateBreakdownCsv = (breakdownKey) => {
    if (!summary || !summary.breakdowns || !summary.breakdowns[breakdownKey]) return '';

    let headers;
    let rows;

    switch (breakdownKey) {
      case 'state':
        headers = ['Name', 'Orders', 'Sales inc GST'];
        rows = summary.breakdowns[breakdownKey].map(item => [
          item.label,
          item.orders,
          dollars(item.revenue_inc_cents)
        ]);
        break;
      case 'coupon':
        headers = ['Name', 'Orders', 'Sales inc GST'];
        rows = summary.breakdowns[breakdownKey].map(item => [
          item.label,
          item.orders,
          dollars(item.revenue_inc_cents)
        ]);
        break;
      case 'freight':
        headers = ['Name', 'Orders', 'Sales inc GST'];
        rows = summary.breakdowns[breakdownKey].map(item => [
          item.label,
          item.orders,
          dollars(item.revenue_inc_cents)
        ]);
        break;
      case 'customer_type':
        headers = ['Name', 'Orders', 'Sales inc GST'];
        rows = summary.breakdowns[breakdownKey].map(item => [
          item.label,
          item.orders,
          dollars(item.revenue_inc_cents)
        ]);
        break;
      default:
        return '';
    }

    return toCsv(headers, rows);
  };

  // Generate CSV for orders table
  const generateOrdersCsv = () => {
    if (!orders || !orders.orders) return '';

    const headers = ['Date', 'Buyer', 'State', 'Items', 'Total', 'Discount', 'Coupon'];
    const rows = orders.orders.map(order => [
      formatDateTime(order.created_at),
      order.name,
      order.state,
      order.units,
      dollars(order.total_cents),
      dollars(order.discount_cents),
      order.coupon || ''
    ]);

    return toCsv(headers, rows);
  };

  if (loading) {
    return <div className="admin-card">Loading...</div>;
  }

  if (error) {
    return (
      <div className="admin-card">
        <p className="form-error">{error}</p>
      </div>
    );
  }

  const kpiData = kpiCards(summary);

  // Determine period bucket for chart title and unit
  let periodBucket = 'day';
  if (summary && summary.period) {
    periodBucket = summary.period.bucket;
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="admin-card">
        <h3 className="admin-heading">Filter</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select name="range" value={range} onChange={handleFilterChange} className="admin-select">
            {PRESETS.map(preset => (
              <option key={preset.key} value={preset.key}>{preset.label}</option>
            ))}
          </select>

          {range === 'custom' && (
            <>
              <input type="date" name="start" value={start} onChange={handleFilterChange} />
              <input type="date" name="end" value={end} onChange={handleFilterChange} />
            </>
          )}

          {range === 'custom' && (
            <button type="button" className="btn btn-primary btn-sm" onClick={handleShowClick}>Show</button>
          )}

          <select name="compare" value={compare} onChange={handleCompareChange} className="admin-select">
            {COMPARISONS.map(comp => (
              <option key={comp.key} value={comp.key}>{comp.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      {kpiData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {kpiData.map(card => (
            <div key={card.key} className="admin-card">
              <h3 className="admin-heading">{card.label}</h3>
              <p className="lead">{card.value}</p>
              <p className={`admin-muted tone-${card.tone}`}>{card.change}</p>
              {card.note && (
                <p className="admin-muted">{card.note}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {summary.kpis.orders === 0 && (
        <div className="admin-card">
          <h3 className="admin-heading">No sales in this period yet</h3>
          <p className="lead">Only live orders are counted.</p>
        </div>
      )}

      {/* Charts */}
      {summary.series && summary.series.length > 0 && (
        <>
          <AdminBars
            title={`Orders per ${periodBucket}`}
            series={seriesForBars(summary.series, 'orders')}
            field="value"
            unit={periodBucket === 'day' ? 'day' : 'week of'}
          />
          <p className="admin-muted">This chart shows the number of orders per {periodBucket}.</p>

          <AdminBars
            title="Sales (inc GST) per day"
            series={seriesForBars(summary.series, 'revenue_inc_cents')}
            field="value"
            unit={periodBucket === 'day' ? 'day' : 'week of'}
          />
          <p className="admin-muted">This chart shows sales (inc GST) per {periodBucket}.</p>
        </>
      )}

      {/* Tables */}
      {summary.top && (
        <>
          {/* Top Products */}
          {summary.top.product && summary.top.product.length > 0 && (
            <div className="admin-card">
              <h3 className="admin-heading">Top Products</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => downloadCsv(generateTopProductsCsv(), 'sales-top-products.csv')}
              >
                Download CSV
              </button>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Items sold</th>
                      <th>Sales ex GST</th>
                      <th>Margin ex GST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.top.product.map((item, index) => (
                      <tr key={index}>
                        <td>{item.label}</td>
                        <td>{item.units}</td>
                        <td>{dollars(item.revenue_ex_cents)}</td>
                        <td>{dollars(item.margin_cents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top Brands */}
          {summary.top.brand && summary.top.brand.length > 0 && (
            <div className="admin-card">
              <h3 className="admin-heading">Top Brands</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => downloadCsv(generateTopBrandsCsv(), 'sales-top-brands.csv')}
              >
                Download CSV
              </button>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Items sold</th>
                      <th>Sales ex GST</th>
                      <th>Margin ex GST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.top.brand.map((item, index) => (
                      <tr key={index}>
                        <td>{item.label}</td>
                        <td>{item.units}</td>
                        <td>{dollars(item.revenue_ex_cents)}</td>
                        <td>{dollars(item.margin_cents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top Categories */}
          {summary.top.category && summary.top.category.length > 0 && (
            <div className="admin-card">
              <h3 className="admin-heading">Top Categories</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => downloadCsv(generateTopCategoriesCsv(), 'sales-top-categories.csv')}
              >
                Download CSV
              </button>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Items sold</th>
                      <th>Sales ex GST</th>
                      <th>Margin ex GST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.top.category.map((item, index) => (
                      <tr key={index}>
                        <td>{item.label}</td>
                        <td>{item.units}</td>
                        <td>{dollars(item.revenue_ex_cents)}</td>
                        <td>{dollars(item.margin_cents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top Suppliers */}
          {summary.top.supplier && summary.top.supplier.length > 0 && (
            <div className="admin-card">
              <h3 className="admin-heading">Top Suppliers</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => downloadCsv(generateTopSuppliersCsv(), 'sales-top-suppliers.csv')}
              >
                Download CSV
              </button>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Items sold</th>
                      <th>Sales ex GST</th>
                      <th>Margin ex GST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.top.supplier.map((item, index) => (
                      <tr key={index}>
                        <td>{item.label}</td>
                        <td>{item.units}</td>
                        <td>{dollars(item.revenue_ex_cents)}</td>
                        <td>{dollars(item.margin_cents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Breakdowns */}
          {summary.breakdowns && (
            <>
              {/* By State */}
              {summary.breakdowns.state && summary.breakdowns.state.length > 0 && (
                <div className="admin-card">
                  <h3 className="admin-heading">By State</h3>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => downloadCsv(generateBreakdownCsv('state'), 'sales-breakdown-state.csv')}
                  >
                    Download CSV
                  </button>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Orders</th>
                          <th>Sales inc GST</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.breakdowns.state.map((item, index) => (
                          <tr key={index}>
                            <td>{item.label}</td>
                            <td>{item.orders}</td>
                            <td>{dollars(item.revenue_inc_cents)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* By Coupon */}
              {summary.breakdowns.coupon && summary.breakdowns.coupon.length > 0 && (
                <div className="admin-card">
                  <h3 className="admin-heading">By Coupon</h3>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => downloadCsv(generateBreakdownCsv('coupon'), 'sales-breakdown-coupon.csv')}
                  >
                    Download CSV
                  </button>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Orders</th>
                          <th>Sales inc GST</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.breakdowns.coupon.map((item, index) => (
                          <tr key={index}>
                            <td>{item.label}</td>
                            <td>{item.orders}</td>
                            <td>{dollars(item.revenue_inc_cents)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* By Freight */}
              {summary.breakdowns.freight && summary.breakdowns.freight.length > 0 && (
                <div className="admin-card">
                  <h3 className="admin-heading">By Freight</h3>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => downloadCsv(generateBreakdownCsv('freight'), 'sales-breakdown-freight.csv')}
                  >
                    Download CSV
                  </button>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Orders</th>
                          <th>Sales inc GST</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.breakdowns.freight.map((item, index) => (
                          <tr key={index}>
                            <td>{item.label}</td>
                            <td>{item.orders}</td>
                            <td>{dollars(item.revenue_inc_cents)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* By Customer Type */}
              {summary.breakdowns.customer_type && summary.breakdowns.customer_type.length > 0 && (
                <div className="admin-card">
                  <h3 className="admin-heading">By Customer Type</h3>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => downloadCsv(generateBreakdownCsv('customer_type'), 'sales-breakdown-customer-type.csv')}
                  >
                    Download CSV
                  </button>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Orders</th>
                          <th>Sales inc GST</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.breakdowns.customer_type.map((item, index) => (
                          <tr key={index}>
                            <td>{item.label}</td>
                            <td>{item.orders}</td>
                            <td>{dollars(item.revenue_inc_cents)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Orders Table */}
      <div className="admin-card">
        <h3 className="admin-heading">Orders</h3>
        <form onSubmit={handleSearch} style={{ marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="admin-input"
          />
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Buyer</th>
                <th>State</th>
                <th>Items</th>
                <th>Total</th>
                <th>Discount</th>
                <th>Coupon</th>
              </tr>
            </thead>
            <tbody>
              {orders.orders && orders.orders.map((order) => (
                <tr key={order.id}>
                  <td>{formatDateTime(order.created_at)}</td>
                  <td>{order.name}</td>
                  <td>{order.state}</td>
                  <td>{order.units}</td>
                  <td>{dollars(order.total_cents)}</td>
                  <td>{dollars(order.discount_cents)}</td>
                  <td>{order.coupon || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => downloadCsv(generateOrdersCsv(), 'sales-orders.csv')}
          >
            Download CSV
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={orders.orders && orders.orders.length < 50}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Not tracked */}
      {summary.not_tracked && summary.not_tracked.length > 0 && (
        <div className="admin-card">
          <h3 className="admin-heading">Not tracked yet</h3>
          <p className="lead">These items need extra tracking and are not guessed.</p>
          <ul>
            {summary.not_tracked.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}