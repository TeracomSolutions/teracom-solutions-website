'use client';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import { BRAND } from '@/lib/brand';

// The Help button on each network's card under Connections > Social: the exact steps to get
// that network's posting credentials, checked against LinkedIn's, Meta's and X's own
// documentation on 2026-10-25 (Robert: "a little icon that just says help, for each tab").
const NAME = BRAND.name;
const SITE = BRAND.custom ? String(BRAND.siteUrl).replace(/\/$/, '') : 'https://www.teracomsolutions.com.au';
const PRIVACY = BRAND.custom ? `${SITE}/privacy` : 'https://www.teracomsolutions.com.au/privacy';
const HERE = 'Connections > Social';

function LinkedInSteps() {
  return (
    <>
      <h4>LinkedIn: getting the posting credentials</h4>
      <p>You need to be an admin of the {NAME} company page on LinkedIn. Allow a few days for LinkedIn to approve step 4.</p>
      <ol>
        <li>Go to <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noreferrer">linkedin.com/developers/apps</a> and select <strong>Create app</strong>. App name &ldquo;{NAME} website&rdquo;, LinkedIn Page &ldquo;{NAME}&rdquo;, upload the logo, tick the legal agreement, then <strong>Create app</strong>.</li>
        <li>On the app&apos;s <strong>Settings</strong> tab, select <strong>Verify</strong> next to the company page and open the link it gives you while signed in as a page admin.</li>
        <li>On the <strong>Auth</strong> tab, under <strong>OAuth 2.0 settings</strong>, add <code>https://www.linkedin.com/developers/tools/oauth/redirect</code> to <strong>Authorized redirect URLs for your app</strong> and save.</li>
        <li>On the <strong>Products</strong> tab, select <strong>Request access</strong> on <strong>Community Management API</strong> and fill in the form (legal business name, website, business email). It must be the only product on this app. Wait for the approval email.</li>
        <li>Open the <a href="https://www.linkedin.com/developers/tools/oauth/token-generator" target="_blank" rel="noreferrer">OAuth token generator</a>, choose this app, tick <code>w_organization_social</code> and <code>r_organization_social</code>, select <strong>Request access token</strong>, sign in as a page admin and select <strong>Allow</strong>. Copy the access token it shows.</li>
        <li>Open the company page as an admin. The address looks like <code>linkedin.com/company/12345678/admin</code>; the number is the page ID.</li>
        <li>On this card: paste the token into <strong>Access token</strong> and <code>urn:li:organization:12345678</code> (with your number) into <strong>Author URN</strong>. Select <strong>Save</strong>, then <strong>Check</strong>. It should say Working.</li>
        <li>The token lasts 60 days. Put a reminder in the calendar and repeat steps 5 and 7 before then.</li>
      </ol>
    </>
  );
}

function FacebookSteps() {
  return (
    <>
      <h4>Facebook: getting the posting credentials</h4>
      <p>You need full control of the {NAME} Facebook Page and a developer account at <a href="https://developers.facebook.com" target="_blank" rel="noreferrer">developers.facebook.com</a> (select <strong>Get Started</strong> there if it asks you to register).</p>
      <ol>
        <li>On developers.facebook.com select <strong>My Apps</strong> &rarr; <strong>Create app</strong>. Name &ldquo;{NAME} website&rdquo;, use case <strong>Manage everything on your Page</strong>, connect it to the business portfolio if asked, then <strong>Create app</strong>.</li>
        <li>In the app, <strong>App settings</strong> &rarr; <strong>Basic</strong>: set <strong>Privacy policy URL</strong> to <code>{PRIVACY}</code> and select <strong>Save changes</strong>. Then switch the app to <strong>Live</strong> at the top of the page (posts from an app in development are only seen by people on the app).</li>
        <li>Open the <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noreferrer">Graph API Explorer</a>. Under <strong>Meta App</strong> choose this app; under <strong>User or Page</strong> choose <strong>Get User Access Token</strong>.</li>
        <li>Under <strong>Permissions</strong> add <code>pages_show_list</code>, <code>pages_read_engagement</code>, <code>pages_manage_posts</code> and <code>pages_manage_metadata</code>. If you will also post to Instagram add <code>instagram_basic</code> and <code>instagram_content_publish</code> now as well. If the Page belongs to a business portfolio, also add <code>business_management</code>.</li>
        <li>Select <strong>Generate Access Token</strong>. In the Facebook window choose the {NAME} Page (and the Instagram account), then <strong>Continue</strong> and <strong>Save</strong>.</li>
        <li>In the Explorer, change the request box to <code>me/accounts</code> and select <strong>Submit</strong>. Under {NAME}, copy the <code>id</code> (the Page ID).</li>
        <li>In the app, <strong>App settings</strong> &rarr; <strong>Basic</strong>: copy the <strong>App ID</strong>, and select <strong>Show</strong> next to <strong>App secret</strong> and copy it.</li>
        <li>On this card: paste the token from step 5 (the Explorer&apos;s <strong>Access Token</strong> box) into <strong>Page access token</strong>, the id into <strong>Page ID</strong>, and the App ID and App secret into their boxes. Select <strong>Save</strong>, then <strong>Check</strong>. With the App ID and secret saved, the console swaps the token on Save for the Page&apos;s own token, which does not expire.</li>
      </ol>
    </>
  );
}

function InstagramSteps() {
  return (
    <>
      <h4>Instagram: getting the posting credentials</h4>
      <p>Instagram posts go through the Facebook Page, so set up the Facebook card first, with the Instagram permissions ticked in its step 4.</p>
      <ol>
        <li>In the Instagram app: profile &rarr; menu &rarr; <strong>Settings and activity</strong> &rarr; <strong>Account type and tools</strong> &rarr; <strong>Switch to professional account</strong> &rarr; <strong>Business</strong>.</li>
        <li>Link it to the Facebook Page: on Facebook open the Page, <strong>Settings</strong> &rarr; <strong>Linked accounts</strong> &rarr; <strong>Instagram</strong> &rarr; <strong>Connect account</strong>, and sign in to Instagram.</li>
        <li>Do the Facebook card&apos;s steps 3 to 5 with <code>instagram_basic</code> and <code>instagram_content_publish</code> added, and choose the Instagram account when Facebook asks. If the Page belongs to a business portfolio, also add <code>ads_management</code> and <code>ads_read</code>.</li>
        <li>In the Graph API Explorer, with that token, change the request box to <code>PAGE-ID?fields=instagram_business_account</code> (your Page ID in place of PAGE-ID) and select <strong>Submit</strong>. Copy the <code>id</code> inside <code>instagram_business_account</code>.</li>
        <li>On this card: paste the same token into <strong>Access token</strong> and that id into <strong>Instagram business account ID</strong>. Select <strong>Save</strong>, then <strong>Check</strong>. The token is swapped for the Page&apos;s own token the same way as Facebook&apos;s, as long as the Facebook card has the App ID and secret.</li>
      </ol>
      <p>Pictures and videos must be at a public web address for Instagram to fetch them; the console does that for you.</p>
    </>
  );
}

function XSteps() {
  return (
    <>
      <h4>X: getting the posting credentials</h4>
      <p>X charges per post from prepaid credits (at 25 October 2026: US$0.015 a post, US$0.20 a post with a link). There is no free plan. Prices are on the Developer Console.</p>
      <ol>
        <li>Go to <a href="https://console.x.com" target="_blank" rel="noreferrer">console.x.com</a> and sign in with the {NAME} X account.</li>
        <li>Buy credits in the Developer Console and set a spending limit, so posting cannot run up a bill.</li>
        <li>Select <strong>Create App</strong>: name &ldquo;{NAME} website&rdquo;, description and use case &ldquo;Posting {NAME}&apos;s own news from our website console&rdquo;.</li>
        <li>In the app&apos;s user authentication settings set <strong>App permissions</strong> to <strong>Read and write</strong> and save. Do this before step 6: tokens made earlier stay read-only.</li>
        <li>In the app&apos;s <strong>Keys and tokens</strong>, generate the <strong>API Key &amp; Secret</strong> and copy both. X shows them only once.</li>
        <li>On the same page generate the <strong>Access Token &amp; Secret</strong> (for your own account) and copy both. They should say <strong>Read and write</strong>; if not, regenerate them after step 4.</li>
        <li>On this card: paste the four values into <strong>API key</strong>, <strong>API key secret</strong>, <strong>Access token</strong> and <strong>Access token secret</strong>. Select <strong>Save</strong>, then <strong>Check</strong>. These do not expire; keep a copy in the password manager.</li>
      </ol>
      <p>X&apos;s documentation does not name the exact screen for step 4; on the app it is the authentication settings section.</p>
    </>
  );
}

function YouTubeSteps() {
  return (
    <>
      <h4>YouTube: the footer link</h4>
      <p>Nothing is posted to YouTube; this card only sets the footer icon.</p>
      <ol>
        <li>Open the {NAME} channel on youtube.com and copy the address from the browser bar (it looks like <code>https://www.youtube.com/@yourchannel</code>).</li>
        <li>On this card: paste it into <strong>Profile link</strong>, tick <strong>Show this link in the website footer</strong>, then <strong>Save</strong>.</li>
      </ol>
    </>
  );
}

const STEPS = { linkedin: LinkedInSteps, facebook: FacebookSteps, instagram: InstagramSteps, x: XSteps, youtube: YouTubeSteps };

export default function SocialSetupHelp({ network }) {
  const Steps = STEPS[network];
  if (!Steps) return null;
  return (
    <AdminHelpIcon label="Help">
      <Steps />
      <h4>Where this lives</h4>
      <p>{HERE}. Secrets are stored encrypted and never shown again; a blank box keeps the saved value.</p>
    </AdminHelpIcon>
  );
}
