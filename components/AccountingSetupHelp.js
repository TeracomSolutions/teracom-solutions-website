'use client';

import AdminHelpIcon from '@/components/AdminHelpIcon';

// The Help button on each accounting platform's card under Connections: how to enrol it, taken from each
// platform's own developer documentation on 28 November 2026 (Xero: developer.xero.com; MYOB:
// developer.myob.com; QuickBooks: developer.intuit.com; Zoho: the Zoho API Console as connected on 27 November).
function Redirect({ uri }) {
  return uri ? <code>{uri}</code> : <>the address shown on this card</>;
}

function ZohoSteps({ uri }) {
  return (
    <>
      <h4>Zoho Books: connecting</h4>
      <ol>
        <li>Sign in to the Zoho API Console with the Zoho Books owner&apos;s login. The address bar shows your data centre: <code>api-console.zoho.com</code> is <strong>us</strong>, <code>.com.au</code> is <strong>au</strong>, <code>.eu</code> is <strong>eu</strong>.</li>
        <li>Choose <strong>ADD CLIENT</strong>, then <strong>Server-based Applications</strong> (not Self Client). Enter your website address as the Homepage URL and <Redirect uri={uri} /> as the <strong>Authorized Redirect URI</strong>, then create it.</li>
        <li>Copy the Client ID (it starts <code>1000.</code>) and, from the <strong>Client Secret</strong> tab, the secret.</li>
        <li>On this card select <strong>Edit</strong>: paste both, set the data centre, leave Organisation ID blank or enter the one from Zoho Books &gt; Settings &gt; Organisation Profile, and <strong>Save</strong>.</li>
        <li>Select <strong>Connect to Zoho Books</strong>, tick the box that allows access and select <strong>Accept</strong>. You come back here connected.</li>
      </ol>
    </>
  );
}

function XeroSteps({ uri }) {
  return (
    <>
      <h4>Xero: connecting</h4>
      <ol>
        <li>Go to <a href="https://developer.xero.com/app/manage" target="_blank" rel="noreferrer">developer.xero.com/app/manage</a> and sign in with your Xero login.</li>
        <li>Add a new app. Xero&apos;s guide says to create an OAuth 2.0 app and select the <strong>Auth Code</strong> grant type (a web app that keeps its secret on the server).</li>
        <li>Enter <Redirect uri={uri} /> as the redirect URI. It must match exactly.</li>
        <li>Copy the <strong>Client ID</strong>, then generate a <strong>Client Secret</strong> and copy it. Keep it private.</li>
        <li>On this card select <strong>Edit</strong>, paste both and <strong>Save</strong>.</li>
        <li>Select <strong>Connect to Xero</strong>, sign in, choose the organisation and allow access. You come back here connected; <strong>Test</strong> names the organisation.</li>
      </ol>
      <p>Good to know, from Xero: the website keeps access by refreshing its token; if it is not used for 60 days the refresh token expires and you press Connect again. The free Starter tier allows up to 5 connected organisations. It asks for invoices, payments, contacts and settings (items, accounts and tax rates).</p>
    </>
  );
}

function MyobSteps({ uri }) {
  return (
    <>
      <h4>MYOB Business: connecting</h4>
      <ol>
        <li>Ask MYOB for API access with their developer request form (linked from MYOB&apos;s Getting Started page at developer.myob.com). MYOB sets up a my.MYOB developer login.</li>
        <li>Sign in at <a href="https://my.myob.com.au/" target="_blank" rel="noreferrer">my.myob.com.au</a>, open the <strong>Developer</strong> tab and select <strong>Register App</strong>.</li>
        <li>Enter the app&apos;s name and <Redirect uri={uri} /> as the redirect URL, then select <strong>Register App</strong>. The <strong>API Key</strong> and <strong>API Secret</strong> are shown on the page.</li>
        <li>On this card select <strong>Edit</strong>: paste the key and secret, and enter the user name and password of the MYOB company file login the website should use (MYOB needs it for company file data), then <strong>Save</strong>.</li>
        <li>Select <strong>Connect to MYOB Business</strong>, sign in and choose the business. You come back here connected; <strong>Test</strong> lists the company file.</li>
      </ol>
      <p>Good to know, from MYOB: access tokens last 20 minutes and are renewed automatically. It asks for the company file, company settings, sales, purchases, customer and supplier contacts, and inventory.</p>
    </>
  );
}

function QuickBooksSteps({ uri }) {
  return (
    <>
      <h4>QuickBooks Online: connecting</h4>
      <ol>
        <li>Sign in at <a href="https://developer.intuit.com" target="_blank" rel="noreferrer">developer.intuit.com</a> and create an app; when asked, select the <strong>QuickBooks Online Accounting</strong> scope.</li>
        <li>Add <Redirect uri={uri} /> as a redirect URI for the app. It must match exactly, including https and no trailing slash.</li>
        <li>Open <strong>My Hub &gt; App dashboard</strong>, open the app and select <strong>Keys and credentials</strong>. Choose <strong>Production</strong> for your real company (or <strong>Development</strong> for a sandbox company) and turn on <strong>Show credentials</strong>. Intuit only shows Production keys after its Production Key questionnaire is completed and approved.</li>
        <li>On this card select <strong>Edit</strong>: paste the Client ID and Client secret, set <strong>Keys for</strong> to production or sandbox to match, and <strong>Save</strong>.</li>
        <li>Select <strong>Connect to QuickBooks Online</strong>, sign in, choose the company and connect. You come back here connected; <strong>Test</strong> names the company.</li>
      </ol>
      <p>Good to know, from Intuit: access tokens last an hour and are renewed automatically; the refresh token lasts 100 days from its last use (at most five years), after which you press Connect again.</p>
    </>
  );
}

const STEPS = { zoho_books: ZohoSteps, xero: XeroSteps, myob: MyobSteps, quickbooks: QuickBooksSteps };

export default function AccountingSetupHelp({ connectionKey, redirectUri }) {
  const Steps = STEPS[connectionKey];
  if (!Steps) return null;
  return (
    <AdminHelpIcon label="Help">
      <Steps uri={redirectUri} />
      <h4>Where this lives</h4>
      <p>System &gt; Connections &gt; Services, Accounts and payments. Secrets are stored encrypted and never shown again; a blank box keeps the saved value.</p>
    </AdminHelpIcon>
  );
}
