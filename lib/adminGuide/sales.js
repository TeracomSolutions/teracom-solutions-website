const guide = `## Sales

What was sold, to whom, and what it earned, worked out from the live orders on the website. Test and simulated orders are never counted.

### How to get there

Click **Sales** in the main menu.

### What you see

Pick a period at the top (the last 7, 30 or 90 days, this month, last month, this year so far, or your own dates) and whether to compare it with the period before or the same dates last year. Cards show orders, sales with and without GST, the average order, items sold, the margin (what is left after the supplier cost and any discount, before GST), discounts, freight, and orders from new and returning customers, each with the change against the comparison. Two charts show orders and sales over time. Tables show the best sellers by product, brand, category and supplier, and sales by state, coupon, freight and new versus returning buyers. The list at the bottom is every order in the period; search by name or email. Every table has a **Download CSV** button.

### Good to know

- Days are Melbourne days and money is in Australian dollars.
- The margin uses the supplier cost saved on each order line when it was sold. Lines with no cost are counted and mentioned on the card, not guessed.
- A card at the bottom lists what is **not tracked yet** (the visit-to-purchase funnel, refunds, device and traffic source). Those need extra tracking and are not shown as made-up numbers.
- **Carts and unfinished checkouts** (below the figures): the saved carts of signed-in customers (active, abandoned after an hour untouched, expired after 30 days, or became an order), the value left behind, the products left behind most, and checkouts that expired or whose payment failed, with a CSV of everything. Two switches turn the recording on; both are off until the privacy policy says carts and unfinished checkouts are kept. Expired checkouts also need the checkout.session.expired event switched on for the website's webhook in Stripe. Everything is removed after 90 days.

### Where each order is up to

Every order has a strip of eleven stages: Paid, Customer in Zoho, Products in the store and Zoho, Prices on the Zoho items, Invoice created, Invoice marked sent, Payment recorded, Supplier order raised, Supplier order sent, Shipped with tracking, and Complete. Marketplace supplier orders (CJ, AliExpress, Banggood) count as supplier orders.

- On **Sales > Orders** each order shows one mark per stage: green done, yellow waiting or preview only, red a problem, grey not started. Point at a mark to see the stage and its time. Use **At stage** to list the orders sitting at one stage, and **Stuck only** for orders where nothing has moved for a day.
- On an order's page, **Where this order is up to** lists every stage with its time, a link to the record in Zoho, any problem, and the button that moves it on (Prepare, Approve or Retry, or Open supplier orders).
`;

export default guide;