# Teracom Solutions Website

The Teracom Solutions marketing and commerce website — homepage, SecurityOS
AI product page, store, Stripe checkout, and lead capture.

Extracted from the combined `teracom-commerce-platform-v3` app per
`Website_Application_Separation_Plan_V1.md` (Website/Application
Separation, Phase 4). The Teracom AI product application now lives
separately in `teracom-ai-frontend`. Git history for every file below was
preserved from the original combined repo via `git filter-repo`.

## Included

- Teracom Solutions homepage
- SecurityOS AI product page
- Teracom Store page with products and plans
- Stripe Checkout API route + webhook (commerce-to-licensing handoff to
  teracom-ai-backend)
- Zoho Books helper integration foundation
- Supplier CSV / JSON / XML feed parser + admin feed import API route
- Lead capture API route
- Sitemap and robots routes

## Repository layout

```text
app/
  layout.js, page.js            homepage
  securityos-ai/page.js         product page
  store/page.js                 store
  checkout/{success,cancel}/    Stripe checkout result pages
  api/checkout/                 Stripe Checkout session creation
  api/webhooks/stripe/          Stripe webhook -> licence provisioning
  api/leads/                    lead capture
  api/admin/import-feed/        supplier feed import
  sitemap.xml/, robots.txt/     Next.js route-handler convention
components/                     Header, Footer, ExpertisePartners, CheckoutButton
lib/                            products, stripe, zoho, feed-importer, config
lib/api/                        client, commerceLicensing, leads
```

## Design system

Visual styling (CSS custom properties, `.btn`/`.hero`/`.section`/`.showcase-*`
etc. class vocabulary) lives entirely in this repo's own `app/globals.css`.
Per `UI_DECOUPLING_PLAN_V1.md` (2026-08-22), the former shared `@teracoms/ui`
package has been dissolved: this app no longer has any cross-repository
dependency for its styling. Edit `app/globals.css` directly for any visual
change; there is no longer a second file or repository to keep in sync.

## Backend dependency

This app is not backend-independent: `lib/api/commerceLicensing.js` (Stripe
webhook handler) and `lib/api/leads.js` (lead capture route) both call
`teracom-ai-backend` server-side via `BACKEND_API_URL`. See `.env.example`.

## Environment variables

See `.env.example` for the full list and what each one is for
(`NEXT_PUBLIC_SITE_URL`, `BACKEND_API_URL`, Stripe, Zoho, admin import
token, internal service token).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev   # serves on :3001 — :3000 is teracom-ai-frontend's, run both side by side
```

## Notes

Stripe and Zoho routes are built but require live credentials before
taking real payments or creating invoices.
