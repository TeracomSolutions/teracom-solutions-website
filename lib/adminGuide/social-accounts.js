export default `## Social: Accounts and Customers

This part of the admin console lets you set up our social media accounts, check their connection status, and view the list of customers who receive email updates.

### How to get there

Click **Social** in the main menu. Then click the **Accounts** tab or the **Customers** tab.

### What you see

**Accounts tab**

The Accounts tab shows one card for each social network we support: LinkedIn, Facebook, Instagram, X and YouTube. Each card has the following elements:

**Network card header**
- Network name (LinkedIn, Facebook, etc.)
- Status badge showing connection status:
  - Not set up
  - Ready
  - Failing

Display name field
- Label: Display name
- Placeholder text: Teracom Solutions on [network name]
- Maximum length: 120 characters

**Profile link field**
- Label: Profile link
- Placeholder text: https://
- Maximum length: 500 characters

**Show this link in the website footer checkbox**
- Label: Show this link in the website footer

Posting credentials section (only for LinkedIn, Facebook, Instagram and X)
- Section label: Posting credentials
- Status indicator showing whether credentials are set or not
  - If set, shows "set: [credential hint]" where credential hint is the list of fields that have values
  - If not set, shows "not set"

Fields in the credentials section:
- LinkedIn
  - Access token (password input)
  - Author URN (password input)
- Facebook
  - Page access token (password input)
  - Page ID (password input)
- Instagram
  - Access token (password input)
  - Instagram business account ID (password input)
- X
  - Access token (OAuth 2.0, tweet.write) (password input)

**Last checked information**
- Shows when the account was last checked
- Shows any error message from the last check

**Action buttons**
- Save button
  - Saves all changes made to this network's settings
  - Disabled when another action is in progress
  - Shows "Saving..." during saving
- Check button
  - Sends a small test request to the network
  - Shows "Checking..." during check
  - Displays result of the check in a note banner below the form
- Clear credentials button (only visible if credentials are set)
  - Removes saved credentials for this network
  - Shows confirmation dialog before proceeding

**Customers tab**

The Customers tab shows a table of all customer accounts on the website.

**Filtering and search controls**
- Search input field (top left)
  - Placeholder: Search name, email, company or phone
  - Maximum length: 200 characters
- Updates filter dropdown (middle left)
  - Options:
    - All updates
    - Receives updates
    - Opted out
    - Never asked
- Tier filter dropdown (middle)
  - Options:
    - All tiers
    - Every pricing tier listed
    - None (shows customers with no tier)
- Account filter dropdown (middle right)
  - Options:
    - All accounts
    - Login set
    - Imported
- Sort dropdown (right)
  - Options:
    - Sort: Name
    - Sort: Company
    - Sort: Email
    - Sort: Customer since
    - Sort: Tier
    - Sort: Updates
    - Sort: Account
- Page count indicator (right)
  - Shows "Loading..." when refreshing the table
  - Shows "Page N of M" once loaded

**Customer table**
| Field | What to put in it |
|-------|-------------------|
| Name | Customer's name, with company shown below if different |
| Email | Email address, as a mailto link |
| Phone | Phone number or dash if none |
| Tier | Pricing tier or dash if none |
| State | Customer's state or dash if none |
| Updates | Status label:
  - Receives updates
  - Opted out
  - Never asked
  - Shows in colour based on status |
| Account | Status label:
  - Login set (if customer can sign in)
  - Imported (if account was brought over from old store) |
| Customer since | Date when the customer account was created |

**Pagination controls**
- Previous button
  - Disabled on first page
  - Changes to previous page when clicked
- Next button
  - Disabled on last page
  - Changes to next page when clicked

### Step by step

**To set up a LinkedIn account**
1. Click the **Accounts** tab in the Social section.
2. Find the LinkedIn card.
3. Enter the display name in the Display name field.
4. Enter the profile link in the Profile link field.
5. Tick the Show this link in the website footer checkbox if you want it shown.
6. Fill in the Access token and Author URN fields under Posting credentials.
7. Click **Save** to save the settings.
8. Click **Check** to verify that the connection works.

**To set up a Facebook account**
1. Click the **Accounts** tab in the Social section.
2. Find the Facebook card.
3. Enter the display name in the Display name field.
4. Enter the profile link in the Profile link field.
5. Tick the Show this link in the website footer checkbox if you want it shown.
6. Fill in the Page access token and Page ID fields under Posting credentials.
7. Click **Save** to save the settings.
8. Click **Check** to verify that the connection works.

**To set up an Instagram account**
1. Click the **Accounts** tab in the Social section.
2. Find the Instagram card.
3. Enter the display name in the Display name field.
4. Enter the profile link in the Profile link field.
5. Tick the Show this link in the website footer checkbox if you want it shown.
6. Fill in the Access token and Instagram business account ID fields under Posting credentials.
7. Click **Save** to save the settings.
8. Click **Check** to verify that the connection works.

**To set up an X account**
1. Click the **Accounts** tab in the Social section.
2. Find the X card.
3. Enter the display name in the Display name field.
4. Enter the profile link in the Profile link field.
5. Tick the Show this link in the website footer checkbox if you want it shown.
6. Fill in the Access token field under Posting credentials.
7. Click **Save** to save the settings.
8. Click **Check** to verify that the connection works. The check will wait for a console update as X's developer console needs an update before the access token is valid.

**To set up a YouTube account**
1. Click the **Accounts** tab in the Social section.
2. Find the YouTube card.
3. Enter the display name in the Display name field.
4. Enter the profile link in the Profile link field.
5. Tick the Show this link in the website footer checkbox if you want it shown.
6. Click **Save** to save the settings.
7. Click **Check** to verify that the connection works.

**To find a customer**
1. Click the **Customers** tab in the Social section.
2. Use the filter controls to narrow down the list:
   - Search by name, email, company or phone
   - Filter by update status (Receives updates, Opted out, etc.)
   - Filter by tier
   - Filter by account type (Login set, Imported)
3. Sort the table using the Sort dropdown.
4. Navigate through pages using Previous and Next buttons.

### Good to know

- All credentials are stored encrypted and never shown again after saving.
- Credentials are only saved when you click Save.
- The Check button sends a real test request to each network.
- If an account fails, the error message from the network is shown.
- The last checked date updates automatically after each check.
- Customer list refreshes automatically when filters or search terms change.
- Customers can update their own consent status using unsubscribe links in emails or their accounts.
- Each network has its own connection credentials.

### If something goes wrong

- Error message: "Unable to load the social accounts from the backend."
  - This happens when there is a problem connecting to the server.
  - Refresh the page to try again.
- Error message: "Unable to load the customer list from the backend."
  - This happens when there is a problem connecting to the server.
  - Refresh the page to try again.
- Error message: "The backend did not accept that."
  - This error appears when saving account settings fails.
  - Check that all required fields are filled correctly and try again.
- Error message: "Not working: [specific error]"
  - This appears after clicking Check if the network connection failed.
  - Review the credentials entered for this network.
- Error message: "Working: [network name] [details]"
  - This appears after clicking Check if the network connection is successful.
  - Shows the account that was verified and the time taken in milliseconds.
`