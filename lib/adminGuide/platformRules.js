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

### Asking Tera

Ask Tera "what rules are in place?", "why are scrapers blocked?" or "what did we change in Vercel?" from any page and it reads this page.
`;

export default platformRules;
