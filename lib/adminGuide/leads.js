export default `## Leads

This section shows enquiries people send through the contact form on this website. It is for staff to follow up with prospects.

### How to get there

Click **Leads** in the main menu.

### What you see

**Page heading**

The page heading is "Leads" with a help icon. The help text explains:

- "Received" - when the form was submitted
- "Name", "Company" and "Email" are what the visitor typed; the email address is a mail link
- "Message" - shown only when the visitor wrote one; click "Message" next to their name to read it, and again to hide it
- "Enquiry" - which option they chose on the form (Contact sales, Demo request, Trial question, Platform question, Partnership, Technical consulting, SecurityOS, Store). A Contact sales or Demo request enquiry also emails sales@teracomsolutions.com.au when it arrives; the rest are recorded only
- "Status" - "New" until someone marks it, then "Contacted" with the date
- "Mark contacted" - click it once you've replied to the person. It records who marked it and when, in the audit log as well. There is no undo, and nothing is emailed automatically - replying is still something you do yourself
- "Refresh" - reloads the list; new enquiries arrive on their own and do not appear until you refresh or revisit the page

**Lead table**

The table shows these columns:

| Column | What it shows |
|--------|---------------|
| Received | Date and time when the form was submitted |
| Name | Visitor's name |
| Company | Visitor's company name (or "\u2014" if not provided) |
| Email | Visitor's email address as a mail link |
| Enquiry | Type of enquiry chosen from the contact form |
| Status | "New" or "Contacted" with date |
| Action | "Mark contacted" button |

**Buttons**

- **Refresh** - reloads the list of enquiries from the server. New enquiries appear on their own but do not show until you refresh or revisit the page.
- **Message** - shows or hides the visitor's message (if they provided one)
- **Mark contacted** - marks this enquiry as contacted. Records who marked it and when in the audit log. There is no undo, and nothing is emailed automatically - replying is still something you do yourself.

**Status labels**

- **New** - the enquiry has not been contacted yet
- **Contacted** - someone has marked this enquiry as contacted; shows the date of contact

### Tera's draft replies

When an enquiry arrives (the contact form, a Submit a request form, or a question or callback sent from the Ask Tera chat), Tera writes a draft reply from its library within a couple of minutes. Nothing is emailed until someone presses Send.

1. Click **Reply** on the enquiry. Tera's draft opens underneath, with the pages it used.
2. Change the text if you need to.
3. Click **Send reply**, then **Yes, send it**. It is emailed to the person and the enquiry is marked contacted.

- **Draft again** - Tera writes a new draft (also works when drafts are switched off)
- **Discard draft** - drops the draft; you can still write and send your own reply
- **Draft ready** - shown in the Status column while a draft is waiting
- For a **Callback request** the draft is notes for the call; there is no Send button. Ring the person, then click **Mark contacted**

Turn the drafts off or on in **Support > Settings**: "Tera drafts a reply to every new enquiry". Sending needs the mail server set on **Connections** under Email sending.

### Step by step

**To view all current leads**

1. Click **Leads** in the main menu
2. The list of recent enquiries shows with their details
3. Use the **Refresh** button if new enquiries have arrived but are not showing

**To mark a lead as contacted**

1. Find the enquiry you want to mark in the table
2. Click the **Mark contacted** button next to that enquiry
3. The status will change from "New" to "Contacted" with the date and time
4. This action records who marked it and when in the audit log
5. There is no undo for this action

**To read a lead's message**

1. Find the enquiry with a message in the table
2. Click the **Message** button next to their name
3. The full message appears below the button
4. Click the **Message** button again to hide it

### Good to know

- Enquiries arrive automatically from the website's contact form
- New enquiries appear on their own but do not show until you refresh or revisit the page
- The system does not send automatic emails when marking an enquiry as contacted
- There is no undo for marking an enquiry as contacted
- Only staff with admin access can see and manage leads
- The status "New" means no one has contacted this lead yet
- The status "Contacted" shows who marked it and when in the audit log

### If something goes wrong

- "Unable to load the enquiries from the backend." - This error appears if there is a problem connecting to the database. Try refreshing the page.
- "Unable to load website enquiries." - This error appears if there is a problem loading the data. Try refreshing the page.
- "Unable to mark this enquiry as contacted." - This error appears if there was a problem saving the contact status. Try clicking the button again.
`