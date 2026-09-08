import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">404 Error</span>
            <h2>Page Not Found</h2>
            <p className="lead">
              The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>
          </div>
          <Link className="btn btn-primary" href="/">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
