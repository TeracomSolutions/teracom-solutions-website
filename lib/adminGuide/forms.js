export default `## Forms

Forms customers fill in and sign on the website, newest first. The first is the monitoring commissioning form at /forms/monitoring-commissioning, which the monitoring pages link to as **Complete your monitoring details**.

### How to get there

Click **Forms** in the side menu, under Customers.

### What you see

| Column | What it means |
|--------|---------------|
| Received | When the form arrived, Melbourne time. |
| Reference | What the customer was given and quotes back, such as MC-7F3A2C. Click it to open the form. |
| Form | Which form it is. |
| From | The company, the person and their email. |
| Status | New, In progress, Done or Cancelled. |
| Signed copy | The PDF made when the form arrived. |

Choose a form or a status, or search by reference, name, email or company, then click **Show**.

### One form

The form page shows every answer by section, the attached files (click one to download it), the agreement with the version of the terms the customer accepted, when and where they signed, and the signature itself.

**Open the signed copy** opens the PDF. It is made once, when the form arrives, and never changes, so it is the record of what the customer agreed to. The same copy was emailed to the customer and went to every place under Where forms go.

**To work through a form**

1. Open it from the list
2. Set the **Status** (In progress while you set the site up, Done when it is finished, Cancelled if it will not go ahead)
3. Add **Notes** for the team if you need to
4. Click **Save**. The change is recorded in the audit log with your name

### Where it comes from

The website saves each form in the website backend with its answers, signature and files, and emails the signed copy. Nothing is sent to Zoho or the Teracom AI platform yet.

### Where forms go

Under the list of forms, **Where forms go** says where Teracom's copies of every signed form go. The customer always gets their own signed copy by email, whatever is set here.

- **All forms**: the places every form goes unless it has its own list. To begin with this is one email address (Robert's).
- **A form's own list**: tick **Send this form somewhere different** under the form to give it its own places instead.
- **Email**: the signed PDF and any files the customer attached.
- **Network folder**: saves the signed PDF, the attached files and the answers as text into a folder of their own, named with the reference and the company, such as Forms > Monitoring commissioning form > 2026 > MC-7F3A2C Example Pty Ltd on the NAS. The folder path can use {form}, {year} and {month}. The network folder itself (the NAS, the shared folder and a user that may write there) is set up on **Connections**, under Storage, with a Test.
- **Teracom AI Global Platform**: for the 24/7 Monitoring sign-up only, creates or updates the customer's monitoring site.

Click **Save where forms go**. Only a platform admin can change it; the change goes in the audit log.

Each form's page has **Where it went**: every place it was sent or saved, when, and whether it worked, with the reason if it did not. **Send again** repeats every place in the form's current list (tick the box to email the customer again too), for example after the network folder was set up or the NAS was asleep.
`;
