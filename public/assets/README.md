# Site assets

Everything here is served as it is, at `/assets/...`.

```text
public/assets/
  tera/              the Tera mascot poses as WebP (tera-<pose>.webp), drawn by components/TeraPose.js
  logos/             manufacturer and partner logos shown on the brand pages and brand cards
  brands/            brand showcase pictures (<brand>-showcase.svg), and a few brands' own folders
  ai-capabilities/   the pictures for the Teracom AI capability pages
  hero-*.webp        hero images for the page headers
  teracom-*.webp     Teracom artwork used around the site (store, contact, footer, storefront, on-site, Ask Tera)
  tera-avatar.webp, teracom-logo.png, teracom-ai-mascot.png   avatar and logo files
  *.svg              illustrations (hero technology, consulting, store preview, Teracom AI dashboard) and the brand-fallback-<category> pictures a brand page shows when the brand has no showcase picture of its own
```

## Rules

- Name files in lower case with hyphens, no spaces.
- Photographs and artwork are WebP, cropped and resized to the size they are shown at. Logos are SVG where one exists, otherwise PNG.
- The full-size originals of the mascot and the Teracom AI artwork are in the graphics library on the server (VM 101, `/home/teracom/graphics-library/`); its `CATALOG.md` says which original each file here was made from.
- A brand's logo goes in `logos/`, named after the brand (`hikvision.png`) and referenced from `lib/brands.js`.