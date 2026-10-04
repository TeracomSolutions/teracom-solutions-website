const guide = `## Connections

Every outside service the website and console rely on, and the servers and computers we watch, on one page: what each one is for, whether it is working, and when it was last checked.

### How to get there

Click **Connections** in the main menu.

### What you see

A summary line at the top counts the connections in each state, with **Check everything** to test them all at once. Below it the connections are grouped:

| Group | What is in it |
|---|---|
| Servers and computers | This website server (VM 101), the database, the local AI server (VM 400) and any server or PC you add |
| Hosting and network | The website and its certificates, the backend API, Cloudflare, Cloudflare Turnstile, Vercel and this deployment |
| Accounts and payments | Zoho Books and Stripe |
| Store | Australia Post and StarTrack, and the supplier feeds |
| Marketing | Facebook, Instagram and LinkedIn, and Google Analytics |
| AI | The AI providers the Assistant and Scout use |
| Email | The mail server that sends password resets and alerts |

Each card shows the connection's state, what the last check found, and when it ran:

- **Connected** (green): the last check worked
- **Needs attention** (amber): working, but something should be done, such as a Stripe key still in test mode, a certificate within two weeks of expiry or a disk over 85% full
- **Failing** (red): the last check did not work; the message says why
- **Not set up** or **Not checked yet** (grey): no key yet, or press **Test**
- **Set up** (grey): set, but there is nothing here to test, such as Google Analytics

### Buttons on a card

- **Test** checks that connection now and keeps the result
- **Edit** opens the keys for Zoho Books, Cloudflare and Vercel, with the steps to get each key
- **Manage** goes to the page that holds that connection's keys (Freight, Social, AI Connections or Data Feeds)

### Keys

Keys typed here are stored encrypted on the backend and never shown again; the card shows only the last four characters. To change a key, paste the new one and click **Save**. Leaving a key box blank keeps the saved key. **Remove keys** clears them all for that connection.

Stripe, Turnstile and Google Analytics keys are kept in the website's Vercel settings (teracom-solutions-website, Settings, Environment Variables), so they are shown and tested here but changed in Vercel.

### Connecting Zoho Books

1. Click **Edit** on Zoho Books and follow the steps shown to create a Server-based client in the Zoho API Console. Use the redirect address shown on the card.
2. Paste the **Client ID** and **Client secret** and click **Save**.
3. Click **Connect to Zoho Books**, sign in to Zoho and approve access.
4. Zoho sends you back here and the card turns green with the organisation's name.

**Connect again** repeats the sign-in, for example after the Zoho client changes. Saving a different Client ID or Client secret disconnects the old one.

### Watching a server or computer

1. Under Servers and computers click **Add a server or computer**.
2. Give it a name, pick its kind and how often it checks in, and click **Add**.
3. Copy the line shown and paste it on that machine:
   - Windows 10, 11 or Server 2019 and later: in an administrator Command Prompt or PowerShell
   - Linux: with sudo crontab -e
   - Any monitoring tool: send a POST to the address shown
4. Click **Done**. The card turns green at its first check-in.

The line is shown only once. If it is lost, click **New check-in address** on the card and paste the new line; the old one stops working. A machine turns red when it misses two check-ins in a row. **Remove** stops watching it.

This server and the database are checked every time the page opens: disk space, memory, load and how long since the last restart.
`;

export default guide;