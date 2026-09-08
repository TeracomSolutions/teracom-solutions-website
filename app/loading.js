export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--line);
            border-top-color: var(--red);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
        `}
      </style>
      <div className="spinner"></div>
    </div>
  );
}