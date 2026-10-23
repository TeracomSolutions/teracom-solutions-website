// What a page must look like to pass: its stylesheet applied, nothing wider than the screen,
// and real content on it. Returns a list of plain-English problems (empty means the page is fine).
// The same check is meant for every Teracom product (TeracomAi reuses this pattern).
export async function layoutProblems(page) {
  return page.evaluate(() => {
    const problems = [];
    const sheets = Array.from(document.styleSheets).filter((sheet) => {
      try {
        return sheet.cssRules && sheet.cssRules.length > 0;
      } catch {
        return true; // a stylesheet from another address that did load
      }
    });
    if (sheets.length === 0) problems.push('no stylesheet is applied');
    const body = getComputedStyle(document.body);
    const unstyled = body.backgroundColor === 'rgba(0, 0, 0, 0)' && body.marginTop === '8px';
    if (unstyled) problems.push('the page shows browser default styling');
    const overflow = document.documentElement.scrollWidth - window.innerWidth;
    if (overflow > 1) problems.push(`the page is ${overflow}px wider than the screen`);
    const main = document.querySelector('main') || document.body;
    const box = main.getBoundingClientRect();
    if (box.height < 120) problems.push('the main content is missing or almost empty');
    const text = (main.innerText || '').trim();
    if (text.length < 40) problems.push('the page has almost no text');
    return problems;
  });
}
