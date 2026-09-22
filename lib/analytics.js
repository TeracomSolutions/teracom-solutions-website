// Google Analytics 4 and Google Search Console. Both values are public (they
// end up in the page source), so they can live here or in Vercel env vars.
// Leave them empty and nothing is loaded or emitted.
//
// GA_MEASUREMENT_ID: from Analytics > Admin > Data streams > the web stream,
//   looks like 'G-XXXXXXXXXX'.
// GOOGLE_SITE_VERIFICATION: from Search Console > Add property > URL prefix >
//   HTML tag -- only the content="..." value, not the whole <meta> tag. Not
//   needed if the property is verified by DNS TXT record instead.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-01SG2DJRS6';
export const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '';
