export default `## The website

The public website at www.teracomsolutions.com.au, what is on it, where it runs, and how a change gets made. The console pages each have their own section; this one covers the site as a whole.

### The pages
**Home** leads with Teracom as an organisational intelligence company: the services powered by Teracom AI and its eight pillars, organisational memory, Teracom AI, business outcomes, how Teracom AI differs from general AI tools, enterprise security and data protection, what we do, how we deliver, the brands we work with, consulting, the store, about, and the contact form.
**Services** (/services) lists each service, with a page each: access control, CCTV, intrusion alarms, intercoms, audio visual, electrical, automation, networking, software development, integration development, security design consulting, and maintenance and support.
**Monitoring** (/monitoring) covers alarm monitoring, CCTV monitoring, open and close reporting, patrol response, and duress and lone worker monitoring.
**Teracom AI** (/teracom-ai) describes the platform, each capability on its own page, organisational memory, the comparison with general AI tools, and its security.
**Brands** (/brands) has a long page for every brand: the platforms, what the technology does, the range, how a system fits together, and what Teracom does. The drawings on those pages are drawn in each brand's colour from the brand profiles.
**Store** (/store) shows the catalogue by category, product pages, the cart and checkout. Payment is by Stripe. Signed-in customers see member pricing, and freight is worked out from size and weight with a minimum charge.
**Resources** (/resources) holds data sheets, installer manuals, user manuals, brochures, downloads, product videos, the help centre, industry news and the submit a request form.
**Account** (/account) is for customers: sign up, sign in, forgot password and set password.
Also: Tools (calculators), About, Contact, Warranty, Terms, Privacy, Acceptable use and Search.

### Where things come from
**Enquiries:** the contact form (on Home and Contact) becomes a lead under Leads. Register interest on an early access module arrives as an Early Access enquiry with the module named in the message. Forms are checked by Cloudflare Turnstile and a spam guard.
**Products and prices:** supplier price lists and data feeds are imported under Store, which builds the catalogue and the RRP. Price tiers and supplier discounts set the member prices.
**Documents:** Resources watches manufacturer websites for data sheets and manuals, and staff can upload files.
**Research:** Scout runs research tasks, once or on a schedule.
**Visitors:** Website Data counts visits, top pages, sources, countries and devices.
**Social posts:** Social drafts, schedules and posts to the connected accounts.

### Where it runs
The website is a Next.js app hosted on Vercel, with its server code running in Sydney. Merging a change to the main branch on GitHub (TeracomSolutions/teracom-solutions-website) deploys it automatically within a few minutes.
The backend (accounts, orders, leads, catalogue, pricing, Scout, AI connections) is a FastAPI service on the website server (VM 101) with its own Postgres database. The website reaches it at api.teracomsolutions.com.au through a Cloudflare Tunnel, so no port is open to the internet. Its code is in the private TeracomSolutions/teracom-website-backend repository.
The domain's DNS is on Cloudflare. Security headers are set on every page, and both repositories are scanned for known vulnerabilities on every change and weekly. The security review is in the backend repository at docs/SECURITY_REVIEW_2026-10.md.

### Getting something changed or fixed
1. Ask the assistant to write a master prompt. Describe the problem or the change in your own words, and include the page and any error message.
2. Check the master prompt reads right, then hand it to the development session.
3. The change is coded, reviewed and tested on a copy of the site, then merged and deployed. The live page is checked afterwards.

### Good to know
Nothing on the website changes until a change is merged and deployed, and the assistant cannot edit the website or its code itself. Brand pages, guide text and page copy are all part of the code, so changing them goes through a master prompt too.
`;