const platformRules = `
The **Platform rules** page (System > Platform rules) is the one place to see every rule and setting put in place to keep the website safe and cheap to run, so nobody has to remember them.

### Switched on in Vercel now

Read from Vercel each time the page opens, so it shows what is really on, even if someone changed it in Vercel directly:

- **Firewall rules**: what is blocked and when, in plain words, for example "Block when the browser or tool name contains Lightpanda, or the network (AS number) is one of 132203, 45090, 211590".
- **Blocked addresses**: single internet addresses blocked by hand.
- **How long deployments are kept**: production, previews, failed and cancelled builds.

Press **Read again** to ask Vercel straight away; otherwise it is at most two minutes old. **Open in Vercel** goes to the firewall rules there.

### Settings made on purpose

Grouped by where they live (Vercel, website code, the backend, other Teracom systems, follow-ups). Each says what it does, why it was set, where it is changed and when. Examples: scrapers blocked by the Vercel firewall, no preview builds for pull requests, product pages built on each visit, the store catalogue kept 30 minutes, the Cloudflare check, the uptime checker, and the reminders before the Vercel renewal.

Every new setting of this kind is added to this list in the same change that makes it.

### Scheduled jobs

Everything that runs by itself on a timetable, grouped: checks that keep the website working, website and store upkeep, search, marketing and leads, backups and the server, other Teracom systems, and the reminders in Robert's Claude app. Each says what it does, when it runs, where it is set and, where the job keeps one, when it last ran. Every new scheduled job or reminder is added here in the same change.

### Website check

Every hour, and within 15 minutes of each new website release, the backend loads the home page, store, search, cart, contact and brands, plus a different sample of product, category and brand pages each time, both as a visitor and as a signed-in customer. A page fails when it does not load properly or takes more than 8 seconds twice.

- A failure turns the Dashboard's **Live website check** tile red and emails the staff alert address; another email follows when the pages load again.
- The tab lists every page checked last time, its answer and how long it took. **Check now** runs it straight away (about a minute).

### Asking Tera

Ask Tera "what rules are in place?", "why are scrapers blocked?" or "what did we change in Vercel?" from any page and it reads this page.
`;

export default platformRules;
