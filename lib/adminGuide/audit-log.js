const guide = `## Audit log

What staff and the system did, and when: who signed in, what was changed, imported, approved or sent. Use it to see exactly what happened while looking into a problem.

### How to get there

Click **Audit log** in the main menu (it used to be called Activity).

### What you see

The **Audit log** tab lists the newest entries first with the time, who did it, what happened in plain English, which part of the console it belongs to (Orders, Store, Connections and so on) and a short detail. Click a line to open it and see everything recorded about it (passwords and keys are always hidden).

Above the list you can filter: **Search** (a product, file, supplier, person, or an event such as Failed sign-in), **Who** (everyone, the system on its own, or one person), **What kind**, and **From** and **To** dates (Melbourne days). Press **Search** to apply them and **Reset** to clear them. Choose how many lines to show per page (10, 50, 100 or 200) with the buttons at the top and bottom.

**Export to CSV** downloads every entry that matches the filters you applied (up to 50,000) as a spreadsheet file.

The **Job logs** tab shows the end of the log of each background job, and the **System** tab lists what the system did by itself (jobs started, finished or failed, and server errors).

### Good to know

- Sign-ins, failed sign-ins and sign-outs are recorded, together with changes to users and permissions, connections, orders, products, prices, suppliers, coupons, enquiries and more.
- Nothing in the log can be edited from the console.
`;

export default guide;