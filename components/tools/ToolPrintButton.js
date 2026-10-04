'use client';

import { useEffect, useState } from 'react';
import { FileDown } from 'lucide-react';

// Save as PDF on every calculator (Robert, 2026-10-04): opens the browser's
// print window, where "Save as PDF" gives a one-page report. The print
// styles in globals.css swap the page for a plain Teracom layout: logo and
// title, the figures entered, the results, how it works, and the footer.
export default function ToolPrintButton() {
  return (
    <button type="button" className="btn btn-secondary tool-print-button" onClick={() => window.print()}>
      <FileDown size={18} strokeWidth={2} aria-hidden="true" /> Save as PDF
    </button>
  );
}

// Today's date for the report, set in the browser so a statically built
// page does not show the day it was built.
export function PrintDate() {
  const [today, setToday] = useState('');
  useEffect(() => {
    setToday(new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);
  return <span>{today}</span>;
}