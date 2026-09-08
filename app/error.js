"use client";

export default function Error({ error, reset }) {
  return (
    <div className="container section">
      <div className="form-error">
        <h1>Something went wrong</h1>
        <p>We hit an unexpected error loading this page. Please try again.</p>
        <button className="btn btn-primary" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}