const guide = `## Marketplace

Products from outside suppliers (CJ Dropshipping, AliExpress, Banggood and others). You search a supplier or import its products as drafts, approve the ones you want, and later send a supplier order after checking it. Nothing is ever sent to a supplier automatically.

### How to get there

Click **Store** in the main menu, then the **Marketplace** tab.

### Settings

The Settings card says whether the marketplace is on. **Read-only** (the normal setting) lets you search suppliers and import drafts. Sending orders to suppliers is a separate switch and stays off until you turn it on; even then every order needs your approval and a tick. Click **Change settings** to change the switches, the default markup percentage and the US dollar rate used to convert supplier prices. Update the rate when the exchange rate moves.

### Suppliers and their keys

Each supplier has a card. **Set up key** opens a short guide for that supplier and a form: you type your own key there and it is stored encrypted and never shown again. Press **Test** to check it. CJ Dropshipping and AliExpress have connectors, and both start in **test mode** (orders are not real or are not paid). AliExpress also needs you to press **Connect AliExpress** and sign in once. Banggood, BigBuy, Spocket, Zendrop, DSers and Syncee accept a saved key but have no connector yet. Alibaba.com, Made-in-China, Global Sources, DHgate and any other supplier work by spreadsheet.

### Finding and importing products

Pick a supplier with **Use this supplier**. If it has a connector and a working key you can **Search**, work out the price (supplier price plus your markup, plus GST) and **Import as a draft**. For any supplier you can **import a spreadsheet** (a .csv or .xlsx file whose first row is headings, with at least a name and a price column) or **add one product by hand**. Prices are Australian dollars unless the file says USD. A product at or below cost is refused.

### Drafts, approval and going live

Every imported product is an **unpublished draft**. In the Supplier products list press **Check before going live** to see what is blocking it and what to double-check (for example origin and delivery time for overseas items, electrical safety marks for mains-powered goods). Press **Approve** when you are happy. An unapproved supplier product cannot be put live from the Catalog; once approved it goes live like any other product.

### Supplier orders

Prepare a supplier order from a store order (use its order id), look at the items and the delivery address, tick that you checked it, and press **Send to supplier**. This only works when sending orders is switched on in Settings. Use **Check tracking** to bring tracking numbers back.

### Good to know

- Cost and margin figures are for staff only and are never shown to customers.
- A real overseas supplier is not sent a customer's address until the privacy policy setting in Settings is switched on.
- Every change here is recorded in the Audit log.
`;

export default guide;