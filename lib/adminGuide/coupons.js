export default `## Coupons

This page lets you create discount codes that customers can use in the cart. You can set a percentage or fixed amount discount, limit how many times it can be used, and when it expires.

### How to get there

From any admin page, click **Discount codes** in the main menu.

### What you see

**The create form**

This form lets you create a new discount code. It has these fields:

| Field | What to put in it |
|-------|-------------------|
| Code | Letters, numbers, hyphens. Not case sensitive. Cannot be changed once created. |
| What the customer sees | A short description of what the discount is. This appears in the cart. |
| Type | Choose between percentage off or fixed amount off. |
| Percent off or Amount off (dollars) | The discount value. For percentage, enter a number from 1 to 100. For fixed amount, enter the dollar amount. |
| Most it can take off (optional) | If you choose percentage off, you can limit how much discount this code can give. Enter the maximum amount in dollars. |
| Minimum order (optional) | The minimum cart total needed to use this code. Enter the amount in dollars. |
| Expires (optional) | The date this code stops working. Works until the end of that day. |
| Total uses (optional) | How many times this code can be used. Leave blank for unlimited. |
| Only for a trade tier (optional) | Restrict this code to Silver, Gold or Platinum customers only. |
| Note to yourself (optional) | A private note about this code. Never shown to customers.

**Buttons**

- **Create code** - Saves the new discount code and adds it to the list below. 
- **Save changes** - Updates an existing code with your changes.
- **Cancel** - Discards any changes you've made in the form and resets it.
- **Edit** - Opens the edit form for an existing code, pre-filled with its details.
- **Switch off** - Turns off an active code. It will no longer work in the cart.
- **Switch on** - Turns on a disabled code so customers can use it again.

**The codes table**

This shows all your discount codes in a table:

| Column | What it shows |
|--------|--------------|
| Code | The discount code. |
| Discount | The type and amount of discount. |
| Limits | Shows expiry date, maximum uses, trade tier restriction, or customer restriction. |
| Used | How many times this code has been used. |
| Status | Shows if the code is active (working) or off (disabled). |

**Status labels**

- **Active** - The code works in the cart.
- **Off** - The code is disabled and cannot be used.

### Step by step

**To create a new discount code**
1. Fill in the Code field with letters, numbers, or hyphens (not case sensitive).
2. Enter what the customer sees in the What the customer sees field.
3. Select the discount type - percentage off or fixed amount off.
4. Enter the discount value in the next field.
5. If using percentage, you can set a maximum discount in the "Most it can take off" field.
6. Set a minimum order amount if needed in the "Minimum order" field.
7. Set an expiry date if needed in the "Expires" field.
8. Set how many times this code can be used in the "Total uses" field.
9. If restricting to a trade tier, select from the "Only for a trade tier" dropdown.
10. Add a private note in the "Note to yourself" field if needed.
11. Click **Create code** to save the new discount code.

**To edit an existing code**
1. Find the code you want to change in the table below.
2. Click the **Edit** button for that code.
3. Make your changes in the form that appears.
4. Click **Save changes** to update the code.

**To turn a code on or off**
1. Find the code you want to change in the table below.
2. Click the **Switch off** button to disable it, or **Switch on** to enable it.
3. The page will refresh and show the updated status.

### Good to know

- When creating a new code, the Code field cannot be changed later.
- Codes are saved in the system immediately when you click Create code or Save changes.
- If you change an existing code's discount type from percentage to fixed amount (or vice versa), it will be saved as a new code with no history of previous values.
- You can set codes to expire, limit their usage, or restrict them to specific trade tiers.
- Codes are not automatically deleted after they expire or reach their maximum uses.

### If something goes wrong

- **Enter a discount amount.** - You must enter a valid discount value when creating or editing a code.
- **A percentage cannot be more than 100.** - You entered a percentage over 100 when creating a new code.
- **Could not create that code.** - The system could not save the code due to an internal error.
- **Could not save that code.** - The system could not update the code due to an internal error.
- **Could not change that code.** - The system could not enable or disable the code due to an internal error.
- **Could not reach the coupon service.** - The system cannot connect to the discount code server. Try again later.

`