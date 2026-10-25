// Teracom's console only (hidden on a copy for another business): the call sheet for putting Luneva's admin
// console online, checked against Cloudflare's, Vercel's and Crazy Domains' own documentation on 2026-10-25.
// Full version with rollbacks: teracom-ai-docs Handover/Luneva/CALL_SHEET.md.
const guide = `## Luneva: going online

How Robert and Sharon put Luneva's admin console online at admin.luneva.com.au, with its backend at api.luneva.com.au. It takes about 30 minutes. The storefront on www.luneva.com.au stays on Vercel throughout. These steps were checked against the official Cloudflare, Vercel and Crazy Domains instructions on 25 October 2026.

### Before you start (Robert, in Vercel; checked on the live dashboard)

1. Vercel > project **luneva** > **Domains** (in the project's left-hand menu, not under Settings). It lists only www.luneva.com.au.
2. Select **Add Existing**, enter luneva.com.au, then on its row select **Edit** > **Redirect to Another Domain** > **308 Permanent Redirect** to www.luneva.com.au > **Save**. That keeps the bare address working after the move.
3. Vercel shows no email records for luneva.com.au, so nothing needs copying.

### Part 1: Sharon, Cloudflare account and domain

1. Sign up at dash.cloudflare.com/sign-up (**Email**, **Password**, **Create Account**), verify the email, and turn on two-factor (profile > **Authentication**).
2. **Members** > **Invite members**: robert@teracomsolutions.com.au, scope entire account, role **Administrator** > **Create policy** > **Invite members**.
3. **Domains** > **Onboard a domain**: luneva.com.au, **Continue**, **Free** plan.
4. In the scanned records keep only the A records for luneva.com.au and www (Vercel addresses, 216.198.79.x or 64.29.17.x), all **DNS only (grey cloud)**, plus the three CAA records. Delete the * record and anything for admin or api. Then select **Continue**.
5. Write down the two Cloudflare nameservers.
6. At **Crazy Domains**: log in, find luneva.com.au, then **MANAGE** on the Domain Registration row > **Name Servers** tab > **ADD**. Replace ns1.vercel-dns.com and ns2.vercel-dns.com with the Cloudflare pair, then **SAVE RECORD**.
7. Wait for Cloudflare to show **Active** (minutes to a day). The storefront keeps working. Then check that Vercel > luneva > Domains still says Valid Configuration on both rows; if not, Vercel shows the exact record it wants.

To undo Part 1, put ns1.vercel-dns.com and ns2.vercel-dns.com back at Crazy Domains.

### Part 2: Robert, protection first, then the tunnel

1. **Zero Trust**: choose a team name and the **Zero Trust Free plan**. Cloudflare asks for payment details but charges nothing.
2. **Zero Trust** > **Integrations** > **Identity providers** > **Add new identity provider** > **One-time PIN**.
3. **Zero Trust** > **Access controls** > **Policies** > **Add a policy**: name Luneva staff, Action Allow, 24 hours. Include Emails: robert@teracomsolutions.com.au and Sharon's address. Then **Save**.
4. **Zero Trust** > **Access controls** > **Applications** > **Create new application** > **Self-hosted and private** > **Add public hostname**: admin, luneva.com.au. Choose policy Luneva staff and login method One-time PIN, then **Create**.
5. **Networking** > **Tunnels** > **Create a tunnel**: name luneva-vm105, choose Debian. Copy only the token from the command shown; do not run the command.
6. On VM 105, run **sudo nano /etc/cloudflared/token**, paste the token as the only line and save. Then run **sudo chmod 600 /etc/cloudflared/token** and **sudo systemctl enable --now cloudflared**, and select **Continue** in Cloudflare.
7. In the tunnel > **Routes** > **Add route** > **Published application**, add admin.luneva.com.au to http://localhost:3001, then api.luneva.com.au to http://localhost:8000. Cloudflare adds the DNS records by itself, and the tunnel shows Healthy.

To undo Part 2, delete the two routes, then run **sudo systemctl disable --now cloudflared** on VM 105.

### Part 3: finishing

1. Tell the Website session the tunnel is up. It switches the Luneva console to https and admin-only mode, then checks that the storefront is unchanged, that the API answers health and refuses staff routes, and that the console sits behind the email code.
2. With Sharon present, run the first-Administrator step on VM 105. She sets her own password and turns on two-factor.

### Final test

- www.luneva.com.au loads as before.
- admin.luneva.com.au asks for an email, sends a code from noreply@notify.cloudflare.com (valid 10 minutes), then shows the Luneva sign-in.
- api.luneva.com.au/healthz shows status ok.
`;

export default guide;
