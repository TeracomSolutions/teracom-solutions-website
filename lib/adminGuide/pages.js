// "Every console page": a chapter of the guide written from the page register (lib/adminPages.js), so the
// manual and the console assistant cover every page the console has, the moment it is added (Robert,
// 28 November 2026: "we want this absolutely up to date, and I can ask Tera any question").
// lib/__tests__/adminPages.test.js already fails the build when a page has no entry in the register.
import { ADMIN_PAGES } from '../adminPages.js';

export function pagesMarkdown(pages = ADMIN_PAGES) {
  const listed = pages.filter((page) => page.listed !== false);
  const lines = [
    'Every page in the console, with how to get to it, what it is for, what you see on it, where that information comes from and who can open it. The same list is on the **Where to find everything** page.',
    '',
  ];
  for (const page of listed) {
    lines.push(`### ${page.title}`);
    lines.push(`- **How to get there:** ${page.menu || 'not in the menu'} (${page.path})`);
    if (page.what) lines.push(`- **What it is for:** ${page.what}`);
    if (page.shows) lines.push(`- **What you see:** ${page.shows}`);
    if (page.source) lines.push(`- **Where it comes from:** ${page.source}`);
    if (page.access) lines.push(`- **Who can open it:** ${page.access}`);
    if (page.guide) lines.push(`- **More in the guide:** the ${page.guide} section`);
    lines.push('');
  }
  return lines.join('\n');
}

const pages = pagesMarkdown();

export default pages;
