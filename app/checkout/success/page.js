import Link from 'next/link';

export default function Success() {
  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Payment successful</span>
        <h1>Thank you for your order.</h1>
        <p className="lead">
          Your payment has been received. A confirmation will be sent to your email shortly.
        </p>
        <Link className="btn btn-primary" href="/store">
          Back to Store
        </Link>
      </div>
    </main>
  );
}
