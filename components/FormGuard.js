'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { STARTED_FIELD, TRAP_FIELD } from '@/lib/formGuard';

// The invisible half of the spam guard (lib/formGuard.js): a field no
// person sees, kept out of the tab order and away from screen readers, that
// form-filling bots fill anyway; and the moment the form appeared, so the
// handler can tell a person from something that posted in a millisecond or
// never loaded the page at all.
const OFF_SCREEN = { position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' };

function Trap({ inputRef }) {
  return (
    <div style={OFF_SCREEN} aria-hidden="true">
      <label htmlFor={`${TRAP_FIELD}-input`}>Leave this field empty</label>
      <input id={`${TRAP_FIELD}-input`} ref={inputRef} type="text" name={TRAP_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}

// For a plain HTML form that posts itself (the contact form).
export default function FormGuard() {
  const [started, setStarted] = useState('');
  useEffect(() => {
    setStarted(String(Date.now()));
  }, []);
  return (
    <>
      <Trap />
      <input type="hidden" name={STARTED_FIELD} value={started} />
    </>
  );
}

// For a form that sends JSON: render `fields` inside the form and put
// `values()` in the request body as `guard`.
export function useFormGuard() {
  const trapRef = useRef(null);
  const startedRef = useRef(0);
  useEffect(() => {
    startedRef.current = Date.now();
  }, []);
  const values = useCallback(() => ({
    [TRAP_FIELD]: trapRef.current ? trapRef.current.value : '',
    [STARTED_FIELD]: startedRef.current || null,
  }), []);
  return { fields: <Trap inputRef={trapRef} />, values };
}
