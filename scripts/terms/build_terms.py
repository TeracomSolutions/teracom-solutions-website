"""Generate lib/termsDocument.js straight from the signed .docx.

Legal text is not retyped. The document on Z: is the source of truth, and
this script is how it reaches the site, so a reviewer can re-run it against a
new version rather than diffing prose by hand.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from extract_docx import docx_paragraphs  # noqa: E402

DOCX = sys.argv[1] if len(sys.argv) > 1 else (
    r'Z:\Teracom Solution Pty Ltd\Terms And Conditions\Teracom Terms and Conditions v3.0.docx'
)
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else Path('termsDocument.js')

SUB_CLAUSE = re.compile(r'^(\d+\.\d+)\t(.*)$', re.S)
LETTER = re.compile(r'^(\([a-z]+\))\t(.*)$', re.S)
HEADING_NUM = re.compile(r'^([\d.]+)\t(.*)$', re.S)
# "ACL means ..." style entries in the definitions clause.
DEFINITION = re.compile(r'^([A-Z][A-Za-z\- ]{1,30})\s+(means|has the meaning)\b')


def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def parse(paragraphs):
    parts = []
    part = None
    section = None
    preamble = []
    annexure_cells = []
    version_history = None

    for style, listed, text in paragraphs:
        if not text:
            continue

        if style == 'Title':
            continue

        if style == 'Heading1':
            # The prescribed ACL statement is styled as a Heading1 but is not
            # a part of the document -- it is a block inside Part A, and its
            # wording is fixed by regulation.
            if text.lower().startswith('your rights under the australian consumer law'):
                section = {
                    'id': 'consumer-guarantees',
                    'number': None,
                    'heading': text,
                    'prescribed': True,
                    'blocks': [],
                }
                part['sections'].append(section)
                continue

            upper = text.replace('\u2013', '-').replace('\u2014', '-')
            if upper.upper().startswith('PART A'):
                part_id = 'part-a'
            elif upper.upper().startswith('SCHEDULE'):
                part_id = 'schedule-' + re.search(r'SCHEDULE\s+(\d+)', upper.upper()).group(1)
            elif upper.upper().startswith('ANNEXURE'):
                part_id = 'annexure-a'
            else:
                part_id = slugify(text)

            part = {'id': part_id, 'title': tidy_title(part_id, text), 'sections': []}
            parts.append(part)
            section = None
            continue

        if style == 'Heading2':
            if part is None:
                # "How these terms are organised" sits above Part A.
                section = None
                preamble.append({'type': 'heading', 'text': text})
                continue
            match = HEADING_NUM.match(text)
            number, heading = (match.group(1), match.group(2)) if match else (None, text)
            # Anchors are permanent, so they avoid dots: "clause-3-2" rather
            # than "clause-3.2". Schedule clause numbers already carry the
            # schedule number, so they stay unambiguous against Part A.
            section = {
                'id': f"clause-{number.replace('.', '-')}" if number else slugify(heading),
                'number': number,
                'heading': heading,
                'blocks': [],
            }
            part['sections'].append(section)
            continue

        block = to_block(text, listed, style)

        if part is None:
            # The document's own cover block -- title, ABN and version line --
            # is already the page's heading. Repeating it as body copy just
            # makes the reader scroll past the same three lines twice.
            lowered = text.lower()
            if lowered.startswith('terms and conditions of trade') or (
                'version' in lowered and 'effective' in lowered and len(text) < 120
            ):
                continue
            preamble.append(block)
            continue

        if part['id'] == 'annexure-a':
            if text.lower().startswith('version history'):
                version_history = text
                continue
            if section is None and not part['sections']:
                part['sections'].append({'id': 'annexure-a-record', 'number': None, 'heading': None, 'blocks': []})
                section = part['sections'][0]
            if block['type'] == 'para' and len(text) < 90 and not text.endswith('.'):
                annexure_cells.append(text)
                continue
            if annexure_cells and block['type'] == 'para':
                annexure_cells.append(text)
                continue
            section['blocks'].append(block)
            continue

        if section is None:
            # A schedule whose clauses are not preceded by a Heading2.
            section = {'id': f"{part['id']}-body", 'number': None, 'heading': None, 'blocks': []}
            part['sections'].append(section)

        section['blocks'].append(block)

    annexure = pair_up(annexure_cells)
    return parts, preamble, annexure, version_history


PART_TITLES = {
    'part-a': 'Part A — General terms',
    'schedule-1': 'Schedule 1 — Online store orders',
    'schedule-2': 'Schedule 2 — Installation and project services',
    'schedule-3': 'Schedule 3 — Monitoring services',
    'schedule-4': 'Schedule 4 — Teracom AI platform',
    'schedule-5': 'Schedule 5 — Acceptable use policy',
    'annexure-a': 'Annexure A — Version and acceptance record',
}


def tidy_title(part_id, text):
    """The document sets part titles in capitals, which is right for print and
    shouty on a web page. Written out rather than derived, because automatic
    case conversion turns "TERACOM AI PLATFORM" into "Teracom Ai Platform"."""
    return PART_TITLES.get(part_id, text)


def to_block(text, listed, style=''):
    # Word marks a bullet either with numbering properties or with a List
    # style, and this document uses both. Missing the style form turned the
    # two bullets inside the prescribed ACL statement into stray paragraphs.
    if listed or style.startswith('List'):
        return {'type': 'bullet', 'text': text}
    match = SUB_CLAUSE.match(text)
    if match:
        return {'type': 'clause', 'number': match.group(1), 'text': match.group(2)}
    match = LETTER.match(text)
    if match:
        return {'type': 'letter', 'number': match.group(1), 'text': match.group(2)}
    if DEFINITION.match(text):
        return {'type': 'definition', 'text': text}
    return {'type': 'para', 'text': text}


def pair_up(cells):
    if len(cells) < 2:
        return []
    # The annexure is a two-column table: field name, then example.
    rows = []
    for i in range(2, len(cells) - 1, 2):
        rows.append({'field': cells[i], 'example': cells[i + 1]})
    return rows


def main():
    parts, preamble, annexure, version_history = parse(docx_paragraphs(DOCX))

    # The hash covers the document's own text, not the rendered page.
    # Hashing the published HTML would change on every deploy, because the
    # page carries the site header, footer and asset fingerprints -- so an
    # acceptance record would appear to point at a different document every
    # time an unrelated part of the site shipped.
    canonical = json.dumps(
        {'preamble': preamble, 'parts': parts, 'annexure': annexure, 'history': version_history},
        ensure_ascii=False, sort_keys=True, separators=(',', ':'),
    )
    content_hash = hashlib.sha256(canonical.encode('utf-8')).hexdigest()

    header = '''// Terms and Conditions of Trade v3.0.
//
// GENERATED -- do not edit by hand. Produced by scratchpad/build_terms.py from
// "Teracom Terms and Conditions v3.0.docx" on the Z: drive, which is the
// signed source of truth. Re-run the script against a new version rather than
// editing the prose here; hand-editing a legal document in a JS file is how
// the published terms and the signed document quietly stop matching.
//
// The anchors below are permanent. Checkout, the monitoring application and
// every stored acceptance record point at them, so an id that has been
// published must not be renamed or reused.

export const TERMS_VERSION = '3.0';
export const TERMS_EFFECTIVE = '1 October 2026';
export const TERMS_ABN = '49 107 979 546';
export const TERMS_PDF = '/legal/Teracom-Terms-and-Conditions-v3.0.pdf';
export const TERMS_PDF_NAME = 'Teracom-Terms-and-Conditions-v3.0.pdf';

// sha256 of the document's own text, not of the rendered page. This is what
// an acceptance record stores to prove WHAT the customer was shown, so it has
// to change when and only when the wording changes.
export const TERMS_CONTENT_SHA256 = '__CONTENT_HASH__';
export const TERMS_SOURCE_FILE = '__SOURCE_FILE__';

'''

    body = (
        f'export const termsPreamble = {dump(preamble)};\n\n'
        f'export const termsParts = {dump(parts)};\n\n'
        f'export const termsAcceptanceRecord = {dump(annexure)};\n\n'
        f'export const termsVersionHistory = {dump(version_history)};\n\n'
        'export function findTermsPart(id) {\n'
        '  return termsParts.find((part) => part.id === id) || null;\n'
        '}\n'
    )

    header = header.replace('__CONTENT_HASH__', content_hash)
    header = header.replace('__SOURCE_FILE__', Path(DOCX).name)
    OUT.write_text(header + body, encoding='utf-8')
    print(f'{OUT}: {len(parts)} parts, {sum(len(p["sections"]) for p in parts)} sections, '
          f'{len(annexure)} acceptance-record rows')


def dump(value):
    return json.dumps(value, indent=2, ensure_ascii=False)


if __name__ == '__main__':
    main()
