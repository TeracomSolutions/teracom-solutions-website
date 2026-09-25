"""Read a .docx as plain text, keeping paragraph style names.

Output is one line per paragraph, prefixed with its Word style so the
document's structure (headings vs body vs list items) survives the trip.
"""
import re
import sys
import zipfile

NS_T = re.compile(r'<w:t(?:\s[^>]*)?>(.*?)</w:t>', re.S)
PARA = re.compile(r'<w:p\b.*?</w:p>|<w:p\b[^>]*/>', re.S)
STYLE = re.compile(r'<w:pStyle\s+w:val="([^"]+)"')
TAB = re.compile(r'<w:tab\b[^>]*/>')
BREAK = re.compile(r'<w:br\b[^>]*/>')
NUMPR = re.compile(r'<w:numPr\b')
# Text, tabs and breaks have to be read in document order: stripping the tabs
# first and then pulling the <w:t> runs loses the separator between a clause
# number and its text, giving "1.1In these Terms".
PIECE = re.compile(
    r'<w:t(?:\s[^>]*)?>(?P<text>.*?)</w:t>|(?P<tab><w:tab\b[^>]*/>)|(?P<br><w:br\b[^>]*/>)',
    re.S,
)


def unescape(text):
    return (
        text.replace('&lt;', '<')
        .replace('&gt;', '>')
        .replace('&quot;', '"')
        .replace('&apos;', "'")
        .replace('&amp;', '&')
    )


def docx_paragraphs(path):
    with zipfile.ZipFile(path) as zf:
        xml = zf.read('word/document.xml').decode('utf-8')

    for match in PARA.finditer(xml):
        block = match.group(0)
        style = STYLE.search(block)
        style = style.group(1) if style else ''
        listed = bool(NUMPR.search(block))
        parts = []
        for piece in PIECE.finditer(block):
            if piece.group('text') is not None:
                parts.append(unescape(piece.group('text')))
            elif piece.group('tab') is not None:
                parts.append('\t')
            else:
                parts.append('\n')
        yield style, listed, ''.join(parts).strip()


if __name__ == '__main__':
    for style, listed, text in docx_paragraphs(sys.argv[1]):
        if not text:
            continue
        marker = f'[{style}{"/list" if listed else ""}]' if (style or listed) else '[p]'
        print(f'{marker} {text}')
