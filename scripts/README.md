# Scripts

Run from the repository root.

| Script | What it does |
|---|---|
| `build-admin-help.mjs` | Reads the text inside each console page's `<AdminHelpIcon>` and writes `lib/adminHelp.generated.js`, which the Assistant answers questions from. Run by `npm run help:build` and before every build. |
| `terms/build_terms.py` | Generates `lib/termsDocument.js` from the signed Terms and Conditions `.docx`. See `docs/legal/README.md`. |
| `terms/extract_docx.py` | Reads the paragraphs out of a `.docx`; used by `build_terms.py`. |
