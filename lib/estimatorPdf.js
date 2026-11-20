// The Estimator's proposal as a PDF (Robert, 20 November 2026), made in the browser with
// pdf-lib. It is the customer's own proposal to their client, so it carries their business
// details, not ours, and never shows their cost prices or markup.
import { displayDate, estimateTotals, lineFigures, listLines, money, sectionTotals, validUntil } from './estimator.js';
import { pdfSafe, wrapText } from './toolProject.js';

const A4 = [595.28, 841.89];
const MARGIN = 50;
const INK = [0.08, 0.08, 0.1];
const MUTED = [0.4, 0.4, 0.44];
const RULE = [0.82, 0.82, 0.85];
const ACCENT = [0.85, 0.16, 0.2];

export async function makeProposalPdf(estimate) {
  const lib = await import('pdf-lib');
  const doc = await lib.PDFDocument.create();
  const regular = await doc.embedFont(lib.StandardFonts.Helvetica);
  const bold = await doc.embedFont(lib.StandardFonts.HelveticaBold);
  const rgb = ([r, g, b]) => lib.rgb(r, g, b);
  const width = A4[0] - MARGIN * 2;
  const business = estimate.business;
  const title = estimate.name || 'Proposal';

  doc.setTitle(pdfSafe(`Proposal: ${title}`));
  doc.setAuthor(pdfSafe(business.name || ''));
  doc.setSubject(pdfSafe(`Proposal for ${estimate.client.company || estimate.client.name || 'client'}`));
  doc.setCreator('Estimator');

  let page;
  let y;
  const newPage = () => {
    page = doc.addPage(A4);
    y = A4[1] - MARGIN;
  };
  const need = (h) => {
    if (y - h < MARGIN + 20) newPage();
  };
  const write = (value, { size = 10, font = regular, color = INK, x = MARGIN, maxWidth = width, gap = 3 } = {}) => {
    const lines = wrapText(pdfSafe(value), maxWidth, (s) => font.widthOfTextAtSize(s, size));
    for (const line of lines) {
      need(size + gap);
      page.drawText(line, { x, y: y - size, size, font, color: rgb(color) });
      y -= size + gap;
    }
  };
  const right = (value, { size = 10, font = regular, color = INK, at = MARGIN + width, yAt } = {}) => {
    const s = pdfSafe(value);
    page.drawText(s, { x: at - font.widthOfTextAtSize(s, size), y: (yAt ?? y) - size, size, font, color: rgb(color) });
  };
  const rule = (color = RULE, thickness = 0.8) => {
    need(8);
    page.drawLine({ start: { x: MARGIN, y: y - 4 }, end: { x: MARGIN + width, y: y - 4 }, thickness, color: rgb(color) });
    y -= 10;
  };
  const heading = (value) => {
    need(40);
    y -= 12;
    write(value, { size: 13, font: bold });
    y -= 2;
  };
  const bullets = (items) => {
    for (const item of items) {
      need(14);
      page.drawText('-', { x: MARGIN + 2, y: y - 10, size: 10, font: regular, color: rgb(MUTED) });
      write(item, { x: MARGIN + 14, maxWidth: width - 14 });
    }
  };

  newPage();
  // Business details, top left; proposal details, top right.
  const top = y;
  write(business.name || 'Your business name', { size: 18, font: bold });
  const contact = [
    business.abn ? `ABN ${business.abn}` : '',
    business.licence ? `Licence ${business.licence}` : '',
    business.phone,
    business.email,
    business.address,
  ].filter(Boolean);
  for (const line of contact) write(line, { size: 9, color: MUTED, maxWidth: width * 0.55 });
  const leftBottom = y;
  y = top;
  right('PROPOSAL', { size: 16, font: bold, color: ACCENT });
  y -= 22;
  for (const [label, value] of [
    ['Reference', estimate.reference],
    ['Date', displayDate(estimate.date)],
    ['Valid until', displayDate(validUntil(estimate))],
  ]) {
    if (!value) continue;
    right(`${label}: ${value}`, { size: 9, color: MUTED });
    y -= 13;
  }
  y = Math.min(y, leftBottom) - 10;
  rule(ACCENT, 1.5);

  // Who it is for.
  y -= 4;
  write('Prepared for', { size: 9, font: bold, color: MUTED });
  const client = estimate.client;
  for (const line of [client.name, client.company, client.address, client.email, client.phone].filter(Boolean)) write(line);
  if (estimate.site) {
    y -= 6;
    write('Site', { size: 9, font: bold, color: MUTED });
    write(estimate.site);
  }
  y -= 8;
  write(title, { size: 15, font: bold });

  if (estimate.proposal.intro) {
    y -= 6;
    write(estimate.proposal.intro);
  }
  if (estimate.proposal.scope) {
    heading('Scope of works');
    write(estimate.proposal.scope);
  }

  // The price, by section.
  heading('Price');
  const settings = estimate.settings;
  const showLines = estimate.proposal.showLinePrices;
  for (const section of estimate.sections) {
    if (!section.lines.length) continue;
    const s = sectionTotals(section, settings);
    need(36);
    y -= 4;
    const rowY = y;
    write(section.title || 'Section', { font: bold, maxWidth: width - 110 });
    right(`${money(s.sellCents)}`, { font: bold, yAt: rowY });
    for (const line of section.lines) {
      const label = line.type === 'labour'
        ? line.description || 'Labour'
        : `${line.qty} x ${line.name}${line.sku ? ` (${line.sku})` : ''}`;
      if (line.type === 'product' && line.qty <= 0) continue;
      const lineY = y;
      write(label, { size: 9, color: MUTED, x: MARGIN + 12, maxWidth: width - 130 });
      if (showLines) right(money(lineFigures(line, settings).sellCents), { size: 9, color: MUTED, yAt: lineY });
    }
    rule();
  }
  const t = estimateTotals(estimate);
  need(60);
  for (const [label, value, strong] of [
    ['Subtotal (ex GST)', t.subtotal_cents, false],
    ['GST', t.gst_cents, false],
    ['Total (inc GST)', t.total_cents, true],
  ]) {
    const rowY = y;
    right(label, { size: strong ? 12 : 10, font: strong ? bold : regular, at: MARGIN + width - 120, yAt: rowY });
    right(money(value), { size: strong ? 12 : 10, font: strong ? bold : regular, yAt: rowY });
    y -= strong ? 18 : 14;
  }

  const inclusions = listLines(estimate.proposal.inclusions);
  if (inclusions.length) {
    heading('Included');
    bullets(inclusions);
  }
  const exclusions = listLines(estimate.proposal.exclusions);
  if (exclusions.length) {
    heading('Not included');
    bullets(exclusions);
  }
  if (estimate.proposal.payment) {
    heading('Payment');
    write(estimate.proposal.payment);
  }
  if (estimate.proposal.terms) {
    heading('Terms');
    write(estimate.proposal.terms, { size: 9, color: MUTED });
  }

  // Acceptance.
  need(130);
  heading('Acceptance');
  write(`I accept this proposal${business.name ? ` from ${business.name}` : ''} and its terms.`, { size: 10 });
  y -= 14;
  for (const label of ['Name', 'Signature', 'Date']) {
    need(28);
    y -= 18;
    page.drawText(pdfSafe(label), { x: MARGIN, y, size: 9, font: regular, color: rgb(MUTED) });
    page.drawLine({ start: { x: MARGIN + 60, y: y - 2 }, end: { x: MARGIN + 300, y: y - 2 }, thickness: 0.6, color: rgb(RULE) });
  }

  const pages = doc.getPages();
  pages.forEach((p, i) => {
    const footer = pdfSafe(`${business.name ? `${business.name} - ` : ''}${title} - page ${i + 1} of ${pages.length}`);
    p.drawText(footer, { x: MARGIN, y: MARGIN - 24, size: 8, font: regular, color: rgb(MUTED) });
  });
  return doc.save();
}
