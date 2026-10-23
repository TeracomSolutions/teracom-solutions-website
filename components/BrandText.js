'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { BRAND, rebrandText } from '@/lib/brand';

const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'NOSCRIPT']);

function sweep(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const parent = node.parentElement;
    if (parent && !SKIP.has(parent.tagName)) {
      const next = rebrandText(node.nodeValue, BRAND);
      if (next !== node.nodeValue) node.nodeValue = next;
    }
    node = walker.nextNode();
  }
  root.querySelectorAll('[placeholder]').forEach((el) => {
    const next = rebrandText(el.getAttribute('placeholder'), BRAND);
    if (next !== el.getAttribute('placeholder')) el.setAttribute('placeholder', next);
  });
}

// On a copy of the console for another business (Luneva), help, guide and page text written for
// Teracom reads with that business's name and domain instead. Teracom's own site is untouched.
export default function BrandText() {
  const pathname = usePathname();
  useEffect(() => {
    if (!BRAND.custom) return undefined;
    let queued = false;
    const run = () => {
      queued = false;
      sweep(document.body);
    };
    const queue = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(run);
      }
    };
    run();
    const observer = new MutationObserver(queue);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
