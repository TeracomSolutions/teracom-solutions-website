'use client';

import { useEffect, useRef, useState } from 'react';

import { TURNSTILE_SITE_KEY } from '@/lib/turnstile';

// The Turnstile widget.
//
// Managed mode, so almost everyone sees nothing at all and only a suspicious
// session gets an interactive challenge. That challenge is Cloudflare's own
// and is keyboard and screen-reader reachable -- which matters here, because
// these forms include a legal application and nobody should be locked out of
// signing up by a puzzle they cannot operate.
//
// Renders a hidden input as well as the widget, so a plain HTML form that
// posts without JavaScript (the contact form) carries the token too.

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SCRIPT_ID = 'cf-turnstile-script';

function loadScript() {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function TurnstileWidget({ onToken, name = 'cf-turnstile-response' }) {
  const container = useRef(null);
  const widgetId = useRef(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Not configured: render nothing rather than an empty box. The server
    // decides whether a token is required, not this component.
    if (!TURNSTILE_SITE_KEY) return undefined;

    let cancelled = false;

    const set = (value) => {
      if (cancelled) return;
      setToken(value);
      onToken?.(value);
    };

    loadScript()
      .then(() => {
        if (cancelled || !container.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(container.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'dark',
          action: 'submit',
          callback: (value) => set(value),
          // A token expires after a few minutes. The account application is
          // long enough that someone can easily still be typing, so the
          // widget refreshes itself rather than failing at the last step.
          'expired-callback': () => {
            set('');
            if (window.turnstile && widgetId.current) window.turnstile.reset(widgetId.current);
          },
          'error-callback': () => set(''),
        });
      })
      .catch(() => set(''));

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          // Already gone; nothing to clean up.
        }
      }
    };
    // onToken is a fresh closure on every render; re-running this would tear
    // down and recreate the widget continuously.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!TURNSTILE_SITE_KEY) return null;

  return (
    <div className="turnstile-field">
      <div ref={container} />
      <input type="hidden" name={name} value={token} readOnly />
    </div>
  );
}
