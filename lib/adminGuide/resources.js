export default `## Resources

Staff use this section to keep the website up to date with product manuals and data sheets from suppliers. They add supplier or manufacturer websites, which we check on a schedule for new or changed PDFs. The files are copied to our server and shown in a section of the public website.

### How to get there

Click **Resources** in the main menu.

### What you see

The page shows two main areas:

**Upload a document form**

PDF file - choose a file from your computer (up to 50 MB)
Title - give it a descriptive name
Brand - the supplier or manufacturer's name (from the list)
Type - what kind of document it is
Model (optional) - product model number if known
Show it on the website under - where on the public website to show it
Upload button - uploads the file and saves it in the "Uploaded by Teracom" section

**Websites we watch table**

Website column - shows the name of the site, its URL, and brand if different from the site name. Click the name to see the documents collected from that site.
Collects column - lists what types of documents are collected (data sheets, user manuals etc.)
Check column - how often we check the site (daily, weekly, monthly or manual)
Last check column - when it was last checked
Result column - shows if the last check succeeded or failed. If failed, details appear in a fold-down section. Shows how many files were found, new, changed and missing.
Documents column - number of documents collected from that site. Shows how many are on the website and whether they go there automatically.
Next check column - when the next check is scheduled
Actions column - buttons for checking now, pausing checks, editing settings or removing the website

The table has a **Add a website to watch** button at the bottom to add new sites.

**The Add a website to watch form**

| Field | What to put in it |
|---|---|
| Name | e.g. Hikvision downloads |
| Page to watch | https://www.example.com/support/downloads |
| Supplier (optional) | Select from the list of known suppliers |
| Collect | Checkboxes for data sheets, user manuals, installer manuals, brochures, other PDFs |
| Check | Weekly, Daily, Monthly or Only when I click Check now |
| Also follow links on the same site (document libraries, category pages, page 2, 3, ...) up to Max pages | Tick to follow links within the same domain; how many pages one check may read. A document library with 16 pages of listings needs about 20; 60 is a safe default. |
| Max pages | Number between 1 and 500 |
| On the public website | |
| Brand | Shown with every document from this site and used for the brand tabs on the Resources pages. Blank means the website name. |
| Where each kind of document goes | Select a section (catalogue, manuals, etc.) for each document type |
| Publish new documents automatically | Tick to publish new documents to the website immediately |

The **Add and check now** button adds the website and checks it immediately.

The **Save changes** button saves edits to an existing website.

The **Cancel** button closes the form without saving.

**Result column**

When a check fails, you can click on the error message to see details. It shows:
A list of problems with links to help pages
The error message

Documents page of a website (reached from the website's name or folder link)

Website column - puts a document in a section of the public Resources pages
Store SKU - the part number of the product this belongs to; the store shows the document on that product page. Filled in automatically when the file name carries a SKU from the catalogue.
Filters - filter documents by type, status, or brand
Selecting documents - click checkboxes to select multiple documents
Publishing documents - use the toolbar to publish or hide selected documents or all shown
Deleting documents - delete individual documents using the Delete button
Folder tree - shows where files are kept on the server: one folder for this site, a folder per kind inside it, the supplier's file names inside those

### Step by step

**To upload a document**
1. Choose a PDF.
2. Give the document a title.
3. Choose the brand.
4. Choose the type.
5. Enter the model number if known.
6. Choose where it shows on the website.
7. Click Upload.
8. The uploaded document appears in the "Uploaded by Teracom" section with a link to the uploaded documents and "Uploaded by Teracom" in the details.

**To add a website to watch**
1. Click **Add a website to watch** at the bottom of the table
2. Fill in the form fields
3. Click **Add and check now**
4. Watch the Result column for the outcome

**To check a website now**
1. On the websites table, press the **Check now** button on its row
2. The Result shows the outcome
3. Press **Refresh** to reload the table

**To change a website's settings**
1. On the websites table, press the **Edit** button on its row
2. Change the fields such as Brand or where each kind goes
3. Click **Save changes**

**To publish a document to the website**
1. Go to the website's documents page
2. Select the document(s) using checkboxes
3. Click Publish or Hide in the toolbar

**To set a document's Store SKU**
1. Go to the website's documents page
2. Find the document
3. Click the Store SKU column to edit it
4. Enter the part number and save

**To change a document's brand or type**
1. Go to the website's documents page
2. Find the document
3. Click the Brand or Type column to edit it
4. Choose from the list of known brands or types and save

**To delete a document**
1. Go to the website's documents page
2. Find the document
3. Click Delete in the Actions column

**To read the problems of the last check**
1. On the websites table, click on the error message in the Result column for that site
2. The list of problems with links to help pages and the error message will be shown

### Good to know

- The scheduler runs every 15 minutes
- Each website can be checked manually using the "Check now" button
- When a document is published to the website, it shows a link back to the manufacturer's original page
- Documents are automatically assigned a Store SKU if the file name contains one from the catalogue
- Uploading documents adds them to the "Uploaded by Teracom" section
- You can remove a website and all its documents at once using the "Remove" button
- Pausing a website stops its scheduled checks until it is switched back on
- Removing a website also removes its collected documents
- The table shows how many documents are on the website and whether they go there automatically
- You can publish or unpublish documents in bulk from the documents page
- Documents show when they were last changed and how many times they've changed

### If something goes wrong

- Error message: "The request failed." - Check the connection and try again
- Error message: "Too big: the limit is 50 MB." - Choose a smaller file (maximum 50 MB)
- Error message: "The upload failed." - Check the connection and try again
- Error message: "Unable to load Resources from the backend." - Try refreshing the page or contact support
- Error message: "This website is no longer in Resources." - The website was removed
- Error message: "The change was not saved." - Check the connection and try again`