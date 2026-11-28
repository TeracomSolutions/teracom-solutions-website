'use client';

import { useEffect, useRef } from 'react';

// Put inside a GET filter form: changing any box applies the filter straight away (no Filter button), and
// typing in a text box applies it on Enter (Robert, 28 November 2026: the red Filter button only seemed to
// take him back to the top of the page).
export default function AutoSubmitForm() {
  const ref = useRef(null);
  useEffect(() => {
    const form = ref.current?.closest('form');
    if (!form) return undefined;
    const onChange = (event) => {
      if (event.target instanceof HTMLInputElement && event.target.type === 'text') return;
      form.requestSubmit();
    };
    form.addEventListener('change', onChange);
    return () => form.removeEventListener('change', onChange);
  }, []);
  return <span ref={ref} hidden />;
}
