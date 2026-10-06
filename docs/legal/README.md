# Terms and Conditions of Trade

The terms are shown at `/terms`. The signed Word document is the source of truth, kept on the Z: drive in the Terms And Conditions folder (`Teracom Terms and Conditions v3.3.docx` for the current version). The text on the site is never retyped.

## How the text reaches the site

`scripts/terms/build_terms.py` reads the signed `.docx` and writes `lib/termsDocument.js`: the clauses, a version number, the effective date and a SHA-256 of the document's own text. That hash is what each stored acceptance record keeps, to prove exactly what a customer was shown, so it changes only when the wording does.

```bash
python3 scripts/terms/build_terms.py "<path to the signed .docx>" lib/termsDocument.js
```

`lib/termsDocument.js` says it is generated: do not edit it by hand. The anchors in it are permanent, because checkout and every acceptance record point at them.

## The PDF download

`/terms` shows a download button only when the matching PDF has been added to the repository. The PDF is made by hand from the signed document after each amendment, so it can lag the page.

To publish a PDF:

1. Save it as `public/legal/Teracom-Terms-and-Conditions-v<version>.pdf`. The name must match `TERMS_PDF_NAME` in `lib/termsDocument.js`.
2. In the same commit, set `PDF_AVAILABLE` to `true` in `app/terms/page.js`. Never set it before the file is committed.

**Status:** version 3.3, effective 1 October 2026, is published as text. Its PDF has not been added yet, so `PDF_AVAILABLE` is `false` and the page shows no download.