const businessProfile = `
The **Business profile** page (System > Business profile) says who this website belongs to. Everything else reads from it instead of having one business written into the code.

### What reads from it

- **Emails**: password resets show the support email; review requests, outreach emails and form copies use the business name; every staff alert (sign-in lockouts, website check failures, backups, new forms, risky orders) goes to **Staff alerts go to**.
- **The AI**: Tera's support chat, the console assistant, the lead finder, industry articles, service pages and Scout research introduce the business with its name and **short description**, and use **About the business**, **What you sell or install** and **Who your customers are**.
- **Branding and links**: the logo, favicon, main brand colour, and the social and Google Business Profile links.
- **Names**: the **assistant's name** (Tera by default) and the **robots' name** other websites see when the backend reads them.
- **Lead finder**: the sender name, legal name, ABN, address, phone (only when it is shown on the website), reply-to and offer, unless they are set on the Leads page.
- **Tax**: the **tax rate** is used for every ex-tax figure (sales ex GST, margins, price list imports that only give an ex-tax price, repricing). Store prices include tax.
- **Time zone**: the same setting as Connections > Time. Sales days, posting and article slots, outreach business hours and times in emails follow it.

### Things to know

- The page lists what is still to fill in at the top.
- Changes apply within a minute; nothing needs restarting.
- Who may sign in to the console is a security setting kept on the server; it is shown under Email but changed only on the server.
- **Other taxes** are recorded for reference; only the main tax rate is used in sums for now.
`;

export default businessProfile;
