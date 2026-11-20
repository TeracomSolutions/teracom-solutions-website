const reports = `
The **Reports** page (System > Reports) reports on anything in the platform.

### What you can report on

41 kinds of data in seven areas:

- **Selling**: orders, order lines, checkout attempts, carts, coupons and their use, order feedback.
- **Customers**: customers, saved estimates, leads, form submissions, support chats.
- **Store**: products, which supplier has each product, suppliers, price list uploads, import holds, product content jobs.
- **Website**: visits, the site health crawl, Google pages, searches and trends, redirects, news articles.
- **Marketing**: social posts, ad campaigns and results, prospects, outreach emails.
- **AI**: every AI call, support chat answers, assistant messages, Scout research, product studies.
- **System**: staff actions (the audit log), staff sign-ins, system events, backups, resource checks and documents.

Passwords, keys, tokens, addresses people signed in from, file contents and long bodies are never offered.

### Building a report

1. Open a **ready-made** report on the left (for example Sales by month, Top pages, AI calls by provider) or pick the data under **Report on**.
2. **List rows**: tick the columns to show. **Group and total**: group by up to four columns (a date can be grouped by day, week, month, quarter or year) and add totals: count, total, average, lowest, highest or how many different values.
3. **Only include**: filters such as "status is paid" or "country is Australia", and a date range (last 7, 30, 90 days, or from and to).
4. **Sort by** any column shown, choose how many rows (up to 5,000), then **Run**.
5. **CSV** downloads what is shown. Name it and **Save** to keep it on the left; **Save changes**, **Save as new** and **Remove** work on a saved one.

### Things to know

Money is shown in dollars. A report that would run longer than 15 seconds is stopped: narrow the dates or add a filter. Administrators only; each report run is in the audit log.
`;

export default reports;
