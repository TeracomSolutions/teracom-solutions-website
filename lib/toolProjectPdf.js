// The project report as one PDF, made in the browser (Robert, 2026-11-02). The
// project itself is attached inside the PDF as a small data file, so importing the
// same PDF later brings every result back to be changed. pdf-lib is loaded only
// when a PDF is made or imported.
import { ATTACHMENT_NAME, parseProject, pdfSafe, sectionTitle, serializeProject, toolTitle, wrapText } from './toolProject.js';
import { BUSINESS } from './seo.js';

const A4 = [595.28, 841.89];
const MARGIN = 48;
const INK = [0.07, 0.07, 0.07];
const MUTED = [0.38, 0.38, 0.38];
const WARN = [0.72, 0.33, 0.0];

const rgbOf = (lib, [r, g, b]) => lib.rgb(r, g, b);

export async function makeProjectPdf(project, logoBytes) {
  const lib = await import('pdf-lib');
  const doc = await lib.PDFDocument.create();
  const regular = await doc.embedFont(lib.StandardFonts.Helvetica);
  const bold = await doc.embedFont(lib.StandardFonts.HelveticaBold);
  const logo = logoBytes ? await doc.embedPng(logoBytes).catch(() => null) : null;
  const title = project.name || 'Project report';
  const today = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const width = A4[0] - MARGIN * 2;

  doc.setTitle(pdfSafe(title));
  doc.setAuthor(pdfSafe(project.preparedBy || BUSINESS.legalName));
  doc.setSubject('Teracom Solutions free tools project report');
  doc.setCreator('teracomsolutions.com.au/tools/project');
  doc.setKeywords(['Teracom', 'tools', 'project']);

  let page;
  let y;
  const newPage = () => {
    page = doc.addPage(A4);
    y = A4[1] - MARGIN;
  };
  const room = (needed) => {
    if (y - needed < MARGIN + 28) newPage();
  };
  const write = (value, { font = regular, size = 10, color = INK, indent = 0, gap = 3 } = {}) => {
    const lines = wrapText(pdfSafe(value), width - indent, (t) => font.widthOfTextAtSize(t, size));
    for (const line of lines) {
      room(size + gap);
      page.drawText(line, { x: MARGIN + indent, y: y - size, size, font, color: rgbOf(lib, color) });
      y -= size + gap;
    }
  };
  const pair = (label, value, indent = 0) => {
    const labelWidth = Math.min(210, width * 0.42);
    const labelLines = wrapText(pdfSafe(label), labelWidth - 10, (t) => regular.widthOfTextAtSize(t, 9.5));
    const valueLines = wrapText(pdfSafe(value), width - indent - labelWidth, (t) => bold.widthOfTextAtSize(t, 9.5));
    const rows = Math.max(labelLines.length, valueLines.length);
    room(rows * 12.5 + 2);
    for (let i = 0; i < rows; i += 1) {
      if (labelLines[i]) page.drawText(labelLines[i], { x: MARGIN + indent, y: y - 9.5, size: 9.5, font: regular, color: rgbOf(lib, MUTED) });
      if (valueLines[i]) page.drawText(valueLines[i], { x: MARGIN + indent + labelWidth, y: y - 9.5, size: 9.5, font: bold, color: rgbOf(lib, INK) });
      y -= 12.5;
    }
    y -= 2;
  };
  const heading = (value, size = 13) => {
    room(size + 30);
    y -= 8;
    write(value, { font: bold, size, gap: 5 });
  };
  const rule = () => {
    room(10);
    page.drawLine({ start: { x: MARGIN, y: y - 4 }, end: { x: A4[0] - MARGIN, y: y - 4 }, thickness: 0.6, color: rgbOf(lib, [0.85, 0.85, 0.85]) });
    y -= 10;
  };

  // Cover: the dark Teracom band with the logo, then the project details.
  newPage();
  page.drawRectangle({ x: 0, y: A4[1] - 92, width: A4[0], height: 92, color: rgbOf(lib, [0.043, 0.043, 0.043]) });
  if (logo) {
    const scale = 46 / logo.height;
    page.drawImage(logo, { x: MARGIN, y: A4[1] - 69, width: logo.width * scale, height: 46 });
  }
  page.drawText('TERACOM SOLUTIONS FREE TOOLS', { x: A4[0] - MARGIN - regular.widthOfTextAtSize('TERACOM SOLUTIONS FREE TOOLS', 8), y: A4[1] - 52, size: 8, font: regular, color: lib.rgb(1, 1, 1) });
  y = A4[1] - 130;
  write(title, { font: bold, size: 22, gap: 8 });
  write(`Project report, ${today}`, { color: MUTED, size: 10.5, gap: 10 });
  if (project.client) pair('Client', project.client);
  if (project.site) pair('Site', project.site);
  if (project.preparedBy) pair('Prepared by', project.preparedBy);
  pair('Results in this report', String(project.sections.length));
  if (project.notes) {
    heading('Notes', 12);
    write(project.notes);
  }
  if (project.sections.length) {
    heading('Contents', 12);
    project.sections.forEach((section, i) => {
      const name = sectionTitle(section);
      const tool = section.label ? ` (${toolTitle(section.slug)})` : '';
      write(`${i + 1}.  ${name}${tool}`, { size: 10 });
    });
  }

  project.sections.forEach((section, i) => {
    y -= 10;
    room(120);
    rule();
    write(`${i + 1}.  ${sectionTitle(section)}`, { font: bold, size: 14, gap: 5 });
    write(section.label ? toolTitle(section.slug) : `teracomsolutions.com.au/tools/${section.slug}`, { color: MUTED, size: 9 });
    if (section.inputs.length) {
      heading('Figures entered', 10.5);
      for (const line of section.inputs) pair(line.label, line.value);
    }
    if (section.results.length) {
      heading('Results', 10.5);
      for (const line of section.results) {
        if (line.warn) write(line.warn, { color: WARN, size: 9.5 });
        else if (line.note) write(line.note, { color: MUTED, size: 9 });
        else pair(line.label, line.value);
      }
    }
    if (section.notes) {
      heading('Notes', 10.5);
      write(section.notes, { size: 9.5 });
    }
  });

  // Footer on every page, once the page count is known.
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    const left = pdfSafe(`${BUSINESS.legalName}  |  ABN ${BUSINESS.abn}  |  Estimates for planning: check against manufacturers' datasheets.`);
    p.drawText(left, { x: MARGIN, y: 26, size: 7, font: regular, color: rgbOf(lib, MUTED) });
    const right = `Page ${i + 1} of ${pages.length}`;
    p.drawText(right, { x: A4[0] - MARGIN - regular.widthOfTextAtSize(right, 7), y: 26, size: 7, font: regular, color: rgbOf(lib, MUTED) });
  });

  // The project itself, so this PDF can be imported again.
  await doc.attach(new TextEncoder().encode(serializeProject(project)), ATTACHMENT_NAME, {
    mimeType: 'application/json',
    description: 'Teracom tools project: import this PDF at teracomsolutions.com.au/tools/project to keep working on it.',
    creationDate: new Date(),
    modificationDate: new Date(),
  });
  return doc.save();
}

// Finds the project attached to a PDF made above. Returns null when the PDF has none.
export async function readProjectPdf(bytes) {
  const lib = await import('pdf-lib');
  const doc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
  const names = doc.catalog.lookupMaybe(lib.PDFName.of('Names'), lib.PDFDict);
  const embedded = names?.lookupMaybe(lib.PDFName.of('EmbeddedFiles'), lib.PDFDict);
  if (!embedded) return null;
  const found = [];
  const walk = (node, depth) => {
    if (!node || depth > 8) return;
    const list = node.lookupMaybe(lib.PDFName.of('Names'), lib.PDFArray);
    if (list) {
      for (let i = 0; i + 1 < list.size(); i += 2) found.push([list.lookup(i), list.lookup(i + 1)]);
    }
    const kids = node.lookupMaybe(lib.PDFName.of('Kids'), lib.PDFArray);
    if (kids) for (let i = 0; i < kids.size(); i += 1) walk(kids.lookup(i, lib.PDFDict), depth + 1);
  };
  walk(embedded, 0);
  for (const [name, spec] of found) {
    const fileName = name?.decodeText ? name.decodeText() : String(name);
    if (fileName !== ATTACHMENT_NAME || !(spec instanceof lib.PDFDict)) continue;
    const stream = spec.lookupMaybe(lib.PDFName.of('EF'), lib.PDFDict)?.lookup(lib.PDFName.of('F'));
    if (!stream) continue;
    const data = stream instanceof lib.PDFRawStream ? lib.decodePDFRawStream(stream).decode() : stream.getContents();
    return parseProject(new TextDecoder().decode(data));
  }
  return null;
}
