// Document repository for User Manuals, Datasheets and Downloads.
//
// Each entry: { title, category, brand, url, fileType }
//   - title: e.g. "TeraVision NVR-16CH Quick Install Guide"
//   - category: a slug from lib/categories.js (the same taxonomy the
//     Store and Product Videos use) -- used to build the filter tabs.
//     Don't invent a separate category system here.
//   - brand: e.g. "TeraVision" -- shown alongside the title, not used
//     for filtering (category is the filter dimension, kept consistent
//     with the rest of Resources).
//   - url: either a locally hosted file (drop the PDF in
//     public/documents/<type>/ and point here, e.g. '/documents/manuals/x.pdf'),
//     or an external link (a Google Drive "anyone with the link can view"
//     share URL works well -- see the Resources PR description for why
//     that's the recommended starting point over hosting files directly).
//   - fileType: e.g. 'PDF', 'ZIP' -- shown as a small badge, optional.
//
// All three lists are intentionally empty until real documents are added
// -- no placeholder/fake entries.
export const manuals = [];
export const datasheets = [];
export const downloads = [];
