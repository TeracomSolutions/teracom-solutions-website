const guide = `## Connections

Every outside service the website and console rely on, and the servers and computers we watch, on one page: what each one is for, whether it is working, and when it was last checked.

### How to get there

Click **Connections** in the main menu.

### What you see

The page has two tabs: **Services** (everything below) and **Social**, which holds the LinkedIn, Facebook, Instagram, X and YouTube accounts: the footer link for each and the credentials we post with. Each social card has a **Help** button with the exact steps to get that network's credentials. Posting itself is on the Social page.

A summary line at the top counts the connections in each state, with **Check everything** to test them all at once. Below it the connections are grouped:

| Group | What is in it |
|---|---|
| Servers and computers | This website server (VM 101), the database, and every server or PC that checks in, such as TeracomAI-UAT (VM 400) and its local AI model |
| Hosting and network | The website and its certificates, the backend API, Cloudflare, Cloudflare Turnstile, Vercel and this deployment |
| Accounts and payments | Zoho Books and Stripe |
| Store | Australia Post and StarTrack, and the supplier feeds |
| AI | The voice Tera and the Assistant speak with |
| Email | The mail server that sends password resets and alerts |

Each card shows the connection's state, what the last check found, and when it ran:

- **Connected** (green): the last check worked
- **Needs attention** (amber): working, but something should be done, such as a Stripe key still in test mode, a certificate within two weeks of expiry or a disk over 85% full
- **Failing** (red): the last check did not work; the message says why
- **Not set up** or **Not checked yet** (grey): no key yet, or press **Test**
- **Set up** (grey): set, but there is nothing here to test

AI providers are on **AI Connections**, so they are not repeated here.

### Buttons on a card

- **Test** checks that connection now and keeps the result
- **Edit** is on every card:
  - Zoho Books, Cloudflare and Vercel: their keys, with the steps to get each one
  - Voice: the voice engine, the Azure key and region, which Azure voice, the speed and a monthly limit on characters. **Hear it** plays a sample
  - Email sending: the mail server, port, login and sender. Saved here, these replace the server settings file; **Use the server settings** goes back to it
  - Website server, Database, Website and certificates, and Backend API: when the card turns amber or red (disk, database size, certificate days left) and the address checked. **Reset to defaults** puts them back
  - A server or PC that checks in: its name, kind, how often it checks in and notes
  - Australia Post and StarTrack, and Supplier feeds: open the Freight or Data Feeds page
  - Stripe, Cloudflare Turnstile and this deployment: **Edit in Vercel** opens the website's settings in Vercel

### Keys

Keys typed here are stored encrypted on the backend and never shown again; the card shows only the last four characters. To change a key, paste the new one and click **Save**. Leaving a key box blank keeps the saved key. **Remove keys** clears them all for that connection.

Stripe and Turnstile keys are kept in the website's Vercel settings (teracom-solutions-website, Settings, Environment Variables), so they are shown and tested here and changed in Vercel with **Edit in Vercel**.

### Tera's voice

The **Voice (Tera speaking)** card in the AI group controls how Tera and the Assistant sound when they read an answer aloud.

- **browser** (the starting setting): each visitor hears the voice built into their own browser. It costs nothing, but it differs from device to device and can sound robotic. The page picks an Australian voice when the device has one, and prefers the natural-sounding kinds.
- **azure**: a natural Australian voice from Microsoft Azure Speech, the same for everyone. It needs a Speech resource in Azure and its key.

To switch to the Azure voice:

1. Click **Edit** on the Voice card and follow the steps shown to make a Speech resource in the Azure portal in the Australia East region and copy its key.
2. Paste the key into **Azure Speech key**, set **Voice engine** to azure, pick an **Azure voice** (Natasha is the default) and a speaking speed, and click **Save**.
3. Click **Test**: the card turns green when Azure answers, and shows how many characters have been spoken this month. Click **Hear it** to listen.

The monthly limit keeps the bill in check: once that many characters have been spoken in a month, or if Azure does not answer, visitors hear their browser voice instead. A sentence spoken before is kept, so saying it again costs nothing. Only signed-in people can hear the Azure voice, the same people who can ask Tera.

**Hear it** speaks a sample the way visitors will hear it and says which voice answered. **Browser voice to prefer** is optional: type part of a voice name, such as Natasha, to choose that voice when the browser offers it.

### Connecting Zoho Books

1. Click **Edit** on Zoho Books and follow the steps shown to create a Server-based client (not a Self Client, which has no redirect address) in the Zoho API Console for your data centre. Use the redirect address shown on the card, exactly as written.
2. Paste the **Client ID** and **Client secret**. The **Organisation ID** is a different number (Zoho Books, Settings, Organization Profile); for testing use the ID of your test sandbox. Click **Save**.
3. Click **Connect to Zoho Books**, sign in to Zoho and approve access.
4. Zoho sends you back here and the card turns green with the organisation's name.

**Connect again** repeats the sign-in, for example after the Zoho client changes. Saving a different Client ID or Client secret disconnects the old one.

### Zoho order flow switches

Under the connection cards, the **Zoho order flow** card sets what the website may do in Zoho Books when an order is paid. Everything is off until you turn it on.

- **Order flow on**: record paid orders and run the Zoho steps. Off means nothing happens.
- **Send to Zoho**: off means every step is only previewed and nothing reaches Zoho.
- **Mode**: Preview (nothing is sent) or Test (the Zoho test organisation only). Live mode is not set here: it is a server setting.
- **How the flow works**: every stage from Paid to Complete in order, each marked ON, OFF or PREVIEW from the switches, with one sentence on what happens to the next paid order.
- **What it may create in Zoho**: a switch each for Customers, Items, Prices on items, Create invoices, Mark invoices sent, Payments, Create purchase orders and Send purchase orders. Each switch says what happens when it is off: the record is shown as would have sent, nothing reaches Zoho. Prices on items, Mark invoices sent and Send purchase orders follow the switch they were split from until you set them. Automatic sending of purchase orders per supplier stays locked.

Every change is recorded in the Audit log as Zoho order flow settings changed.

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