import gettingStarted from './getting-started.js';
import overview from './overview.js';
import website from './website.js';
import assistant from './assistant.js';
import store from './store.js';
import brandsGuide from './brands.js';
import coupons from './coupons.js';
import resources from './resources.js';
import leads from './leads.js';
import scout from './scout.js';
import search from './search.js';
import aiConnections from './ai-connections.js';
import connections from './connections.js';
import sales from './sales.js';
import marketplace from './marketplace.js';
import socialAccounts from './social-accounts.js';
import socialPosting from './social-posting.js';
import support from './support.js';
import account from './account.js';
import auditLog from './audit-log.js';
import about from './about.js';
import buildProgress from './build-progress.js';

export const GUIDE_SECTIONS = [
  { id: 'getting-started', title: 'Getting started', markdown: gettingStarted },
  { id: 'overview', title: 'Overview', markdown: overview },
  { id: 'website', title: 'The website', markdown: website },
  { id: 'assistant', title: 'Assistant', markdown: assistant },
  { id: 'store', title: 'Store', markdown: store },
  { id: 'brands', title: 'Store: Brands', markdown: brandsGuide },
  { id: 'marketplace', title: 'Store: Marketplace', markdown: marketplace },
  { id: 'coupons', title: 'Coupons', markdown: coupons },
  { id: 'resources', title: 'Resources', markdown: resources },
  { id: 'leads', title: 'Leads', markdown: leads },
  { id: 'scout', title: 'Scout', markdown: scout },
  { id: 'website-data', title: 'Website Data', markdown: search },
  { id: 'ai-connections', title: 'AI Connections', markdown: aiConnections },
  { id: 'connections', title: 'Connections', markdown: connections },
  { id: 'audit-log', title: 'Audit log', markdown: auditLog },
  { id: 'sales', title: 'Sales', markdown: sales },
  { id: 'social-accounts', title: 'Social: Accounts and Customers', markdown: socialAccounts },
  { id: 'social-posting', title: 'Social: Posting and Calendar', markdown: socialPosting },
  { id: 'support', title: 'Support (Ask Tera)', markdown: support },
  { id: 'account', title: 'Account', markdown: account },
  { id: 'about', title: 'About', markdown: about },
  { id: 'build-progress', title: 'Build progress', markdown: buildProgress },
];
