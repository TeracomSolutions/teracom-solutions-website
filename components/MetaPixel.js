'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { isAdminPath } from '@/lib/adminIndexing';
import { isPrivateUrl, loadPixel, validPixelId } from '@/lib/metaPixel';

// The Meta pixel (Robert, 2026-11-03). Loaded only once a Pixel ID is saved
// on Connections > Meta; staff pages are not counted, the same as Google
// Analytics. Each page view is reported here; the shop events go through
// lib/gtag.js.
export default function MetaPixel() {
  const pathname = usePathname() || '';
  const admin = isAdminPath(pathname);
  const [pixelId, setPixelId] = useState('');

  useEffect(() => {
    if (admin || pixelId) return undefined;
    let cancelled = false;
    fetch('/api/meta/config')
      .then((response) => (response.ok ? response.json() : null))
      .then((config) => {
        const id = validPixelId(config?.pixel_id);
        if (!cancelled && id) setPixelId(id);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [admin, pixelId]);

  useEffect(() => {
    if (!pixelId || admin || isPrivateUrl(window.location.search)) return;
    loadPixel(pixelId);
    window.fbq('track', 'PageView');
  }, [pixelId, admin, pathname]);

  return null;
}
