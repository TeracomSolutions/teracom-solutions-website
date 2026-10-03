export default `## Store

The Store section lets you manage the products your store sells. It includes suppliers, price lists, product catalogue and pricing.

### How to get there

Click **Store** in the main menu. Then click one of these tabs:

- **Data Feeds** - the suppliers whose price lists fill the store
- **Catalog** - all products with cost, RRP, margin and tier prices
- **Pricing** - the markup each customer tier pays on our cost
- **Freight** - what customers pay for delivery

### What you see

**Data Feeds page**

Shows every supplier. There is one website, so there is no list of businesses: suppliers are added straight here. Each supplier has:

- Supplier name (click to see its feeds, uploads and brands)
- Type - Distributor (sells many brands) or Manufacturer (makes its own)
- Brands - how many brands its imports keep to, or Not chosen until the first import
- Last import date

Buttons:

- **Add Supplier** - opens a form for the supplier name and type
- **Remove** - deletes the supplier and its uploaded files, after a confirmation. Products already in the store stay there. There is no undo.

**Supplier page**

**Brands section**

Shows the brands this supplier's imports keep to. A distributor file (Leader's, for example) can carry fifty brands when the store sells four. The first import asks which brands to take and remembers them; every later import, by hand or from the feed, takes only those brands.

Buttons:

- **Choose brands** or **Change brands** - opens the brand list from the latest file, with each brand's product count, a search box, and Tick all shown / Untick all shown. Tick the brands, leave **Remember these brands** ticked, and click **Import**
- **Clear rule** - forgets the brands, so the next import asks again

Until brands are chosen, a feed that brings several brands waits (status Waiting) instead of importing everything.

A brand marked **no brand page yet** has no page in the website's Brands section. Its products still sell; ask for a brand page to be made for it.

**Store categories section**

Shows each of the supplier's own categories (for Leader, a category and subcategory such as Network - UniFi > Protect), how many products it has, and the store category those products are listed under on the website (CCTV, Networking, NAS & Storage and so on). This is how imported products appear when a shopper shops by product category.

- **Guess** - nobody has chosen yet; the store category was worked out from the category's name
- **Chosen** - set by staff; every later import keeps to it
- Pick a store category from the list to confirm or change it. Its products move straight away
- **Not in a store category** keeps those products off the category pages (they still have their own page and show in search)

**Direct link or automatic feed section**

Shows any direct links or feeds set up for this supplier. Each one has:

- Name and the start of its address (the rest is hidden because it carries your account key)
- Format and how often it is pulled
- Last pull, result (Ok, Waiting, Failed) and next pull

Buttons:

- **Add a direct link or feed** - paste the supplier's download link (for Leader: Data Feed Center, then CopyLink next to Stock Data Feed - CSV with Heading), name it, choose how often to pull it, and save. It is pulled straight away
- **Pull now** - pulls and imports it immediately
- **Pause** / **Resume** - stops or restarts the scheduled pulls
- **Remove** - removes the feed after confirmation; files it already pulled stay in the upload history

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

- **Choose brands and import** - shown until the supplier has a brand rule: pick the brands, then import
- **Import into store** / **Import again** - imports this price list by SKU, keeping to the supplier's brands
- **Choose other brands** - opens the brand list again for this file

Status labels and what they mean:

- **Uploaded** - file has been uploaded but not yet imported
- **Imported** - file has been successfully imported into the store
- **Failed** - import failed for this file

**Catalog page**

Shows all products in the store catalogue. Imported products start **offline**: they are in the catalogue but not on the website until staff put them live. Each product row has:

- A tick box, for Go live and Take offline
- Website - **Live** (on the website) or **Offline**
- SKU
- Name, with the supplier's photo
- Brand
- Category (the store category it is listed under)
- Supplier
- Cost (ex GST)
- RRP (inc GST)
- Ex GST (RRP ÷ 1.1)
- Margin (Ex GST minus Cost, in dollars and as a percentage of Ex GST)
- Member, Silver, Gold and Platinum tier prices
- Stock quantity
- Active status

Filters: search, supplier, category, **Live and offline / Live on the website / Offline**, show inactive, and thin or negative margin only.

Buttons:

- **Go live** - puts the ticked products on the website. They appear within five minutes, under their store category and in New Arrivals
- **Take offline** - removes the ticked products from the website without losing them
- **Save** - saves changes to the product row
- **Re-price from cost** - sets RRP = Cost × (1 + markup) × 1.1 (GST), rounded to nearest 5 cents
- **Preview** - shows how many rows would change and a few examples without making changes
- **Apply** - applies the re-price changes to all visible rows
- **Export CSV** - downloads the current view as a CSV file

**Pricing page**

Prices are a **markup on cost**: a tier pays our cost ex GST plus the tier's markup, plus GST, rounded to the nearest 5 cents. A tier price never goes above the RRP; where the markup would, the customer pays RRP. Products without a cost sell at RRP. Visitors who are not signed in see RRP.

**Markup on cost by tier section**

Shows the markup percentage for each customer tier:

- Member - any signed-in customer without a Silver, Gold or Platinum tier
- Silver, Gold and Platinum - from the pricing tier on the customer's account (the Zoho import brought them across)
- $100 cost sells for - what a product costing $100 ex GST sells for at that markup, inc GST

Buttons:

- **Save** - saves the tier's markup. Clear the box and save to make that tier pay RRP

**Per-supplier markups section**

Shows each supplier and its own markup for each tier, where it has one. Each supplier has:

- Supplier name
- Product count (how many products this supplier has)
- Last import date
- A markup box per tier. Blank means the tier markup applies

Buttons:

- **Save** - saves the supplier's markup for that tier (clearing the box and saving goes back to the tier markup)

**Price list section**

Shows all active products with cost, RRP, each tier's price (supplier markup first, tier markup otherwise), whether it is live on the website, and when it was last imported. Filter by supplier, search by SKU, name or category, or tick **live on the website only**.

**On the website**

Category pages show each live product as a small tile: photo, brand, name and price. Clicking a tile opens the product's own page with the full description, the photo, part number and brand.

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
- Supplier price lists fill these when they have columns called Weight, Length, Width and Height (kilograms and centimetres; a file whose sizes are in millimetres, like Leader's, is converted)

**To add a supplier**

1. Click **Store** in the main menu (it opens on **Data Feeds**)
2. Click **Add Supplier** below the table
3. Enter the supplier name and choose its type
4. Click **Add Supplier**

**To set up a supplier's direct link (Leader, for example)**

1. In Leader's partner site, open the Data Feed Center and click **CopyLink** next to Stock Data Feed - CSV with Heading
2. In the console, click **Store**, then the supplier's name on **Data Feeds**
3. Click **Add a direct link or feed**, paste the link, give it a name and choose Daily or Weekly
4. Click **Add and pull now**
5. When the pull shows Waiting, click **Choose brands** in the Brands section, tick the brands to sell and click **Import**

**To upload a price list file for a supplier**

1. Click **Store**, then the supplier's name on **Data Feeds**
2. In the **Upload a price list by hand** section, click the file picker
3. Choose a .csv, .xlsx or .xls file (up to 4 MB)
4. Click **Upload**
5. Click **Choose brands and import** (or **Import into store** once brands are chosen)

**To put products on the website**

1. Click **Store**, then **Catalog**
2. Find the products (search, or filter by supplier, category or **Offline**)
3. Tick them (the tick box in the heading ticks every product shown)
4. Click **Go live**
5. Within five minutes they show on the website under their store category and in New Arrivals. Check the photo and price, then put the rest live the same way

**To take products off the website**

1. Click **Store**, then **Catalog**, and choose **Live on the website** in the filter
2. Tick the products and click **Take offline**

**To choose where a supplier's products are listed**

1. Click **Store**, then the supplier's name on **Data Feeds**
2. In **Store categories**, pick a store category next to each supplier category (or **Not in a store category**)
3. The products move straight away, and every later import keeps to it

**To set a tier's markup on cost**

1. Click **Store**, then **Pricing**
2. In **Markup on cost by tier**, enter the markup percentage for the tier (for example Member 20, Silver 15, Gold 12, Platinum 10)
3. Click **Save**

**To add or change a per-supplier markup**

1. Click **Store**, then **Pricing**
2. In **Per-supplier markups**, enter the markup for that supplier and tier
3. Click **Save**

**To search or edit the catalogue**

1. Click **Catalog** in the main menu
2. Type in a search box to filter by SKU, name or category
3. Edit product details directly in the table rows
4. Click **Save** to save changes to a row
5. Use **Re-price from cost**, **Preview**, and **Apply** buttons to update prices for multiple products
6. Click **Export CSV** to download the current view as a CSV file

**To change which brands a supplier brings in**

1. Click **Store**, then the supplier's name on **Data Feeds**
2. In the Brands section, click **Change brands**
3. Tick or untick brands and click **Import**; the new choice applies to every later import
4. Products of brands you untick stay in the store; hide them on the **Catalog** tab if they should not be sold

**To check an upload in the history**

1. Click **Store**, then the supplier's name on **Data Feeds**
2. Scroll to the **Upload history** table
3. Check the status of uploads (uploaded, imported, failed)
4. Click the import button for an upload that has not yet been imported

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

- "Unable to load the suppliers from the backend."
- "Choose which brands to import first." (a feed is waiting for its brands)
- "Unable to load this supplier from the backend."
- "Unable to load the catalogue from the backend."
- "Unable to load pricing from the backend."
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