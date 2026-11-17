const dashboard = `
The **Dashboard** page (second in the menu, under Overview) shows the health of every area of the console at a glance. Overview is the map of every area; Dashboard says whether each one is healthy.

### The lights

- **Green**: healthy, nothing to do.
- **Amber**: working, with something to look at.
- **Red**: a problem.
- **Grey**: that tile could not be read just then; the others still show.

Each tile says why in one line and shows two or three numbers. Click a tile to open that area. The line at the top sums up the whole platform and counts the lights. It checks again every minute while the page is open, or press **Refresh**.

### What turns each tile amber or red

- **Sales**: red when an order step failed in the last 30 days; amber when a step waits for approval.
- **Store**: red when a supplier feed is failing; amber when a price list failed to import this week or products are held for a price check.
- **Leads**: amber when a new lead has waited more than 3 days.
- **Forms**: red when a form could not be delivered this week; amber when a new form is unopened after 2 days.
- **Support**: red when Ask Tera's library failed to build; amber when there are questions it could not answer.
- **Website Data**: red when many pages are not loading; amber when a few are, or there were no visits in 24 hours.
- **Live website check**: red when a page in the hourly check (as a visitor or signed-in customer) is not loading; amber when it has not run for over 3 hours. Opens System > Platform rules.
- **Scout**: red when a research run failed this week; amber when reports wait for review.
- **Resources**: red when more than half the watched websites could not be checked; amber when some could not.
- **Social**: red when a post failed to go out this week; amber when an account is not connecting.
- **AI activity**: red when more than a quarter of AI requests failed in 24 hours; amber above 1 in 20.
- **Connections**: red when a connection is failing; amber when one needs attention. Connections that are not set up do not count.
- **Backups**: red when the last backup failed or there is no good backup for more than 9 days (2 days on a daily schedule); amber until the Backup NAS is set up.
- **Server and jobs**: red when a job failed or there were more than 50 server errors in 24 hours; amber for any server error.

### Asking Tera

Ask Tera "is everything healthy?" or "what needs attention?" from any page and it reads the same lights.
`;

export default dashboard;
