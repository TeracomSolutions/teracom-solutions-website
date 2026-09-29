export default `## Store

The Store section lets you manage the products your store sells. It includes suppliers, price lists, product catalogue and pricing.

### How to get there

Click **Store** in the main menu. Then click one of these tabs:

- **Businesses** - companies that supply products to your store
- **Catalog** - all products with cost, RRP, margin and tier prices
- **Pricing** - customer price tiers and how they apply to products

### What you see

**Businesses page**

Shows a list of businesses that supply products to your store. Each business has:

- Business name (click to see its suppliers)
- Website URL (opens in a new tab)
- Created date

Buttons:

- **Add Business** - opens a form to add a new business
- **Remove** - deletes the business and all its suppliers and uploaded files. There is no undo.

**The Add Business form**

Fields:

| Field | What to put in it |
|---|---|
| Business name | Text, required |
| Website URL | Valid URL format, required |

Buttons:

- **Add Business** - saves the business and refreshes the table
- **Cancel** - closes the form without saving

**Suppliers page**

Shows a list of suppliers for this business. Each supplier has:

- Name (click to see its price lists)
- Type - either "Manufacturer" or "Distributor"
- Last import date (when one of its price lists was last imported into the store; blank until first import)
- Created date

Buttons:

- **Add Supplier** - opens a form to add a new supplier
- **Remove** - deletes the supplier and all its uploaded files. There is no undo.

**The Add Supplier form**

Fields:

| Field | What to put in it |
|---|---|
| Supplier name | Text, required |
| Supplier type | Either "Manufacturer" or "Distributor", required |

Buttons:

- **Add Supplier** - saves the supplier and refreshes the table
- **Cancel** - closes the form without saving

**Supplier price lists page**

**Automatic feeds section**

Shows any automatic feeds set up for this supplier. Each feed has:

- Feed address (URL or file path)
- Frequency (how often to pull)
- Last pulled date
- Status (active or inactive)

Buttons:

- **Pull now** - runs one immediate import of the feed
- **Edit** - opens a form to edit this feed
- **Delete** - removes the feed after confirmation

**Upload a price list by hand section**

Form for uploading price list files directly:

Fields:

| Field | What to put in it |
|---|---|
| Feed file | .csv, .xlsx or .xls file up to 4 MB |

Buttons:

- **Upload** - uploads the file and adds it to the upload history table

**The upload history table**

Shows a list of all uploaded files for this supplier. Each upload has:

- File name
- How (either "Feed" or "By hand")
- Uploaded date
- Status (one of: uploaded, imported, failed)
- Rows (number of rows in the file)
- Imported date

Buttons:

- **Import into store** - imports this price list into the store catalogue by SKU. If it's already been imported, shows **Import again**

Status labels and what they mean:

- **Uploaded** - file has been uploaded but not yet imported
- **Imported** - file has been successfully imported into the store
- **Failed** - import failed for this file

**Catalog page**

Shows all products in the store catalogue. Each product row has:

- SKU
- Name
- Brand
- Category
- Supplier
- Cost (ex GST)
- RRP (inc GST)
- Ex GST (RRP ÷ 1.1)
- Margin (Ex GST minus Cost, in dollars and as a percentage of Ex GST)
- Silver tier price
- Gold tier price
- Platinum tier price
- Stock quantity
- Active status

Buttons:

- **Save** - saves changes to the product row
- **Re-price from cost** - sets RRP = Cost × (1 + markup) × 1.1 (GST), rounded to nearest 5 cents
- **Preview** - shows how many rows would change and a few examples without making changes
- **Apply** - applies the re-price changes to all visible rows
- **Export CSV** - downloads the current view as a CSV file

**Pricing page**

**Pricing tiers section**

Shows the default discount percentages for each customer tier:

- Silver tier (percentage off RRP)
- Gold tier (percentage off RRP)
- Platinum tier (percentage off RRP)

Buttons:

- **Save** - saves the tier defaults

**Per-supplier overrides section**

Shows a list of suppliers and their override percentages for each customer tier. Each supplier has:

- Supplier name
- Silver tier override percentage
- Gold tier override percentage
- Platinum tier override percentage
- Product count (how many products this supplier has)
- Last imported date

Buttons:

- **Save** - saves any changes to the overrides

**Price list section**

Shows all active products with their RRP, each tier's price (override first, tier default otherwise), cost where the feed carried one, and when it was last imported. Filter by supplier or search by SKU, name or category.

### Step by step

**Freight page**

Store → **Freight** sets what customers pay for delivery. Every price includes GST and is never below the **Minimum charge** you set.

- **Our own rate**: Minimum charge, Weight covered by the minimum (kg), Each extra kilo or part of one ($), Name customers see, and Offer our own rate at checkout
- **Size and weight**: the Cubic weight factor (250), the default parcel used for any product without a weight or size, and Sent from postcode
- **Australia Post**: Offer Australia Post at checkout, the services (Parcel Post, Express Post) and the API key
- **StarTrack**: Offer StarTrack at checkout, the services (Road Express, Premium, Fixed Price Premium), API key, API password and Account number
- **Try a quote**: shows what a customer would be offered for one product sent to a postcode

**Catalog columns for freight**

- **Weight kg**: the shipping weight of one unit
- **L × W × H cm**: its packed length, width and height
- Supplier price lists fill these when they have columns called Weight, Length, Width and Height (kilograms and centimetres)

**To add a new business**

1. Click **Businesses** in the main menu
2. Click **Add Business** below the table
3. Enter a business name
4. Enter a website URL
5. Click **Add Business**

**To add a supplier to a business**

1. Click **Businesses** in the main menu
2. Click on the business name to see its suppliers
3. Click **Add Supplier** below the table
4. Enter a supplier name
5. Select a supplier type (Manufacturer or Distributor)
6. Click **Add Supplier**

**To upload a price list file for a supplier**

1. Click **Businesses** in the main menu
2. Click on a business to see its suppliers
3. Click on a supplier name to see its price lists
4. In the **Upload a price list by hand** section, click the file picker
5. Choose a .csv, .xlsx or .xls file (up to 4 MB)
6. Click **Upload**

**To set a tier's discount**

1. Click **Pricing** in the main menu
2. In the **Pricing tiers section**, enter the discount percentage for each tier
3. Click **Save**

**To add or change a per-supplier override**

1. Click **Pricing** in the main menu
2. In the **Per-supplier overrides section**, enter the override percentages for each tier
3. Click **Save**

**To search or edit the catalogue**

1. Click **Catalog** in the main menu
2. Type in a search box to filter by SKU, name or category
3. Edit product details directly in the table rows
4. Click **Save** to save changes to a row
5. Use **Re-price from cost**, **Preview**, and **Apply** buttons to update prices for multiple products
6. Click **Export CSV** to download the current view as a CSV file

**To set up or run an automatic feed for a supplier**

1. Click **Businesses** in the main menu
2. Click on a business to see its suppliers
3. Click on a supplier name to see its price lists
4. In the **Automatic feeds section**, click **Add feed** or **Edit**
5. Enter the feed address and frequency
6. Click **Save**
7. Click **Pull now** to run an immediate import

**To check an upload in the history**

1. Click **Businesses** in the main menu
2. Click on a business to see its suppliers
3. Click on a supplier name to see its price lists
4. Scroll to the **Upload history** table
5. Check the status of uploads (uploaded, imported, failed)
6. Click **Import into store** for an upload that has not yet been imported

### Good to know

- Automatic feeds are pulled every 15 minutes
- Re-importing the same SKUs updates them rather than creating duplicates
- Inactive products stay in the system but don't appear in the store
- All changes are recorded in the audit log
- Products without a cost are skipped during re-pricing
- Each product can have its own active status (active or inactive)
- Delivery is charged on the greater of the real weight and the cubic weight (length × width × height in metres × 250)
- A product with no weight or size yet is sent as the default parcel, so enter real sizes for heavy or bulky items
- Customers enter their postcode in the cart, see the cheapest price, and pick from every switched-on option when they pay
- If Australia Post or StarTrack does not answer, our own rate is used so checkout never stops
- The Zoho invoice gets a Delivery line; it says "check freight" when the customer gave a different postcode at payment

**To set delivery prices**

1. Click **Store** in the main menu, then the **Freight** tab
2. Under Our own rate, set the Minimum charge, the weight it covers and the price of each extra kilo
3. Check the default parcel and the Sent from postcode under Size and weight
4. Click **Save freight settings**
5. Under Try a quote, enter a postcode and a weight and click **Get prices** to see what a customer would pay

**To switch on Australia Post**

1. Get a free Postage Assessment Calculator API key from developers.auspost.com.au
2. On the Freight tab, paste it into API key under Australia Post
3. Tick the services to offer and tick **Offer Australia Post at checkout**
4. Click **Save freight settings**, then use Try a quote to check a price comes back

**To switch on StarTrack**

1. You need a StarTrack business account; its API key and password come from the Australia Post developer centre for that account
2. On the Freight tab, fill in API key, API password and Account number under StarTrack
3. Tick the services to offer and tick **Offer StarTrack at checkout**
4. Click **Save freight settings**, then use Try a quote to check a price comes back

**To give a product its weight and size**

1. Click **Store**, then the **Catalog** tab
2. Find the product and type the Weight kg and the L × W × H cm
3. Click **Save** on that row

### If something goes wrong

Error messages you might see:

- "Unable to load the businesses from the backend."
- "Unable to load the suppliers for this business."
- "Unable to load this supplier from the backend."
- "Unable to load the catalogue from the backend."
- "Unable to load pricing from the backend."
- "Failed to add business"
- "Failed to add supplier"
- "The import failed."
- "Choose a file first."
- "Failed to upload file."
- "Unable to reach the admin service."

If you see any error message:

1. Check that you have internet access
2. Make sure the file you're trying to upload is in the correct format (.csv, .xlsx or .xls)
3. Ensure the file size is under 4 MB
4. If the problem continues, contact a system administrator
`