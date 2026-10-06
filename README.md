# Teracom Solutions website

The public website at https://www.teracomsolutions.com.au and the staff console at `/admin`: marketing pages, the online store with Stripe checkout, brand and product pages, free tools and calculators, Resources, the Ask Tera assistant, and lead capture.

It is a Next.js 15 (App Router) and React 19 application, written in JavaScript, deployed on Vercel (Sydney region) from the `main` branch. It keeps no data of its own: everything is read from and written to the website backend, the separate repository `teracom-website-backend`, which runs on VM 101 and is reached at https://api.teracomsolutions.com.au through a Cloudflare Tunnel.

## Repository layout

```text
app/                    pages and API routes (the App Router)
  admin/                the staff console: one folder per page (suppliers, catalog, pricing, brands, leads, support ...)
  api/                  route handlers: checkout, Stripe webhook, leads, Ask Tera, voice, and /api/admin/* for the console
  store/ brands/ tools/ resources/ ...   public pages, one folder per section
  layout.js, globals.css                 the shared page frame and the whole stylesheet
components/             React components shared across pages (Admin* for the console)
lib/                    plain JavaScript: pricing and calculators, formatting, session handling, search
  api/                  server-only clients for the backend, one per area
  adminGuide/           the console's Help guide, one file per section
  __tests__/            the tests (node:test), named after the module they cover
public/                 static files served as they are; see public/assets/README.md
scripts/                build-time scripts; see scripts/README.md
docs/                   documentation; start at docs/README.md
brand-assets/           original brand artwork (see brand-assets/README.md)
.github/workflows/      CI (lint, test, build) and the dependency audit
middleware.js           keeps console sessions fresh and guards /admin
next.config.mjs, vercel.json, jsconfig.json, .eslintrc.json, .nvmrc   tool configuration
```

The `@/` import alias means the repository root (`@/lib/...`, `@/components/...`).

## Working on it

Needs Node 20 (`.nvmrc`).

```bash
npm install
cp .env.example .env.local   # fill in what you need; see .env.example
npm run dev                  # http://localhost:3001
npm test                     # node --test, no browser or backend needed
npm run lint
npm run build
```

`npm run help:build` rewrites `lib/adminHelp.generated.js` from the help behind each console page's `?` icon. It runs before every build, and a test fails if the committed file is out of date, so after changing a console page's help run it and commit the result. The Assistant in the console answers questions from that help.

## Configuration

Every setting is an environment variable. `.env.example` lists them with what each is for. Real values live in Vercel (Project Settings, Environment Variables); the website never reads a secret from the repository. The backend address is `BACKEND_API_URL`, and the website's server proves who it is to the backend with `WEBSITE_FRONTEND_SERVICE_TOKEN`, which must match the backend's setting of the same name. Keys that staff enter in the console (AI providers, Zoho, Cloudflare, Vercel, voice) are stored encrypted by the backend, not here.

## Deploying

A merge to `main` deploys to production on Vercel. The CI workflow runs on every pull request. Production deployments are listed in the repository's GitHub deployments (environment `Production`).

## Conventions

- A new page is a folder under `app/` with a `page.js`; its server-side calls to the backend go through a module in `lib/api/`. Those modules refuse to load in the browser.
- Logic that can be tested without a browser goes in `lib/` with a test in `lib/__tests__/`; components stay thin.
- Each console page has a `?` help icon, and a matching section in `lib/adminGuide/`. Keep both up to date when the page changes.
- Pictures go in `public/assets/`, as WebP where they are photos or artwork, in the folder that matches what they are (`public/assets/README.md`).
- Documents go in `docs/` and are listed in `docs/README.md`.
- No keys, passwords or customer data in the repository, in code or in documents.