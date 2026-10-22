const guide = `## Build progress

Where each coding job stands and how the coding factory is doing, without asking anyone. For Administrators only.

### How to get there

Click **Build progress** in the main menu.

### What you see

Summary chips at the top count the items at each of five steps: **Planned**, **Being built**, **In tests**, **Merged** and **Live**. Below them the items are grouped (Today, Tomorrow, After that, Other work). Each item shows a five-step bar, a plain note, its owner and its pull requests with their checks. The step is worked out from real facts: a merged pull request running on the live site is Live, an open pull request is In tests, a coding task running or waiting is Being built, and anything else is Planned.

The **Coding factory** panel shows the graphics card (how busy it is, its memory and the model loaded), how many jobs are running and waiting, how many finished or failed in the last hour and day, the checks running on GitHub, and the jobs themselves with their status, an estimated percent complete, how long they have taken and how many tokens they used. A table of recent OpenHands conversations shows steps, time and tokens, so you can tell whether something is going slowly. The **Sessions** panel shows when each Claude session last updated its notes.

### Choosing what is coded first

Every item shows its place in the coding order. **Up** and **Down** move it within its group, **Do next in this group** puts it at the top of its group and **Do first** puts it first overall. Queued coding tasks that belong to an item follow this order. Every change is recorded in the Audit log as Build priority changed.

### Good to know

- The page refreshes itself every minute.
- A warning appears when the information is older than 30 minutes. That usually means a collector has stopped: the one on the coding server, or the one that asks GitHub.
- The percent complete for a running job is an estimate from how long similar jobs take. Time and tokens are the real figures.
- The page is for Teracom's own build work, so it is switched off on a separate copy of the site such as Luneva's.
`;

export default guide;