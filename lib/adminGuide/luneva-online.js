// Teracom's console only (hidden on a copy for another business): the call sheet for putting Luneva's admin
// console online. Full runbook, DNS snapshot and checks: teracom-ai-docs Handover/Luneva/.
const guide = `## Luneva: going online

How Robert and Sharon put Luneva's admin console online at admin.luneva.com.au, with its backend at api.luneva.com.au. It takes about 30 minutes on a call. The Luneva storefront on www.luneva.com.au stays on Vercel exactly as it is. A snapshot of every DNS record was taken on 25 October 2026 before any change.

### Part 1: Sharon, Cloudflare account and the domain

1. Create a free account at dash.cloudflare.com with a Luneva email address, turn on two-factor sign-in, and invite robert@teracomsolutions.com.au as Administrator (Manage account > Members).
2. **Add a domain**: luneva.com.au, Free plan, and let it scan.
3. Keep only these records and delete everything else (including any * record and any admin or api records): the luneva.com.au and www **A** records, each set to **DNS only (grey cloud)**, and the three **CAA** records. Vercel's addresses (64.29.17.x and 216.198.79.x) all work. Grey cloud matters: orange cloud on www or the apex would break the storefront.
4. Write down the two Cloudflare nameservers.
5. At **Crazy Domains**: Domains > luneva.com.au > Nameservers > Custom. Replace ns1.vercel-dns.com and ns2.vercel-dns.com with the two Cloudflare ones, then press **Check nameservers** in Cloudflare. It can take up to a day to show Active; the storefront keeps working the whole time.

To undo Part 1, put ns1.vercel-dns.com and ns2.vercel-dns.com back at Crazy Domains.

### Part 2: Robert, the tunnel

1. Cloudflare **Zero Trust** (Free plan) > Networks > Tunnels > **Create a tunnel** > Cloudflared > name luneva-vm105. Copy only the token. Do not run the install command it shows.
2. On VM 105 (10.0.0.152), run **sudo nano /etc/cloudflared/token**, paste the token as the only line and save. Then run **sudo chmod 600 /etc/cloudflared/token** and **sudo systemctl enable --now cloudflared**. The token never goes in chat, a command line or a file anywhere else.
3. In the tunnel > Public Hostname, add in this order: api.luneva.com.au with Path ^/(staff|internal|docs|redoc|openapi\\.json)(/.*)?$ to HTTP_STATUS 404; then api.luneva.com.au to HTTP localhost:8000; then admin.luneva.com.au to HTTP localhost:3001.
4. **Access > Applications > Add > Self-hosted**: admin.luneva.com.au, Allow these emails: robert@teracomsolutions.com.au and Sharon's address, One-time PIN, 24-hour session.

To undo Part 2, delete the three public hostnames, then run **sudo systemctl disable --now cloudflared** on VM 105.

### Part 3: finishing

1. Tell the Website session the tunnel is up. It switches the Luneva console to https and admin-only mode, then checks that the storefront is the same page as before. It also checks that api.luneva.com.au answers health and refuses staff routes, and that admin.luneva.com.au sits behind the email PIN.
2. With Sharon present, run the first-Administrator step on VM 105. She gets a single-use link, chooses her own password and turns on two-factor.

### Final test

- www.luneva.com.au loads as before.
- admin.luneva.com.au asks for an email PIN, then shows the Luneva sign-in.
- api.luneva.com.au/healthz shows status ok.
`;

export default guide;
