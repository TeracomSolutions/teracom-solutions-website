// "Your orders" on the account page: each order with its items, total, delivery and where it is up to
// (Robert, 28 November 2026). The status wording comes from the backend (services/customer_orders.py).
const money = (cents) => `$${((cents || 0) / 100).toFixed(2)}`;
const day = (iso) => (iso ? new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

export default function CustomerOrders({ orders, error }) {
  return (
    <section className="customer-orders" aria-labelledby="your-orders">
      <h2 id="your-orders">Your orders</h2>
      {error ? <p className="form-error">Your orders could not be loaded just now. Please try again soon.</p> : null}
      {!error && (!orders || orders.length === 0) ? <p className="admin-muted">No orders yet. Orders you place while signed in, or with this email address, appear here.</p> : null}
      {(orders || []).map((order) => (
        <article key={order.id} className="customer-order">
          <header>
            <strong>Order {order.reference}</strong> <span className="admin-muted">placed {day(order.placed_at)}</span>
          </header>
          <p><strong>{order.status_label}.</strong> {order.status_note}</p>
          {order.tracking_number ? (
            <p>Tracking number: <strong>{order.tracking_number}</strong>{order.delivery ? ` (${order.delivery})` : ''}{order.shipped_at ? `, sent ${day(order.shipped_at)}` : ''}</p>
          ) : null}
          <ul>
            {order.items.map((item, i) => (
              <li key={i}>{item.quantity} x {item.name} <span className="admin-muted">{money(item.unit_price_cents)} each</span></li>
            ))}
          </ul>
          <p>Delivery{order.delivery ? ` (${order.delivery})` : ''}: {money(order.freight_cents)}. <strong>Total paid: {money(order.total_cents)}</strong> (GST included){order.job_reference ? `. Your reference: ${order.job_reference}` : ''}</p>
        </article>
      ))}
      <p className="admin-muted">Questions about an order? Ask Tera or contact us with the order number.</p>
    </section>
  );
}
