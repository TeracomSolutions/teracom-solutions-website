// Document repository for User Manuals, Datasheets and Downloads.
//
// Each entry: { title, brand, url, fileType }
//   - title: e.g. "TeraVision NVR-16CH Quick Install Guide"
//   - brand: e.g. "TeraVision" -- used to build the filter tabs
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
