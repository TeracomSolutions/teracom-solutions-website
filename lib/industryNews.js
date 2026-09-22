/**
 * Parse RSS items from SEN.news feed
 *
 * @param {string} xml - RSS XML content
 * @param {Object} options
 * @param {string} options.allowedHost - Hostname to allow (default: 'sen.news')
 * @param {number} options.limit - Maximum number of items to return (default: 12)
 * @returns {Array<{title: string, link: string, date: string|null}>} Parsed items
 */
export function parseRssItems(xml, { allowedHost = 'sen.news', limit = 12 } = {}) {
  const items = [];
  const itemRegex = /<item>(.*?)<\/item>/gs;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
    const itemXml = match[1];
    
    // Extract title (handling CDATA)
    let title = '';
    const titleMatch = itemXml.match(/<title>(.*?)<\/title>/s);
    if (titleMatch) {
      title = titleMatch[1].trim();
      // Remove CDATA wrapper if present
      if (title.startsWith('<![CDATA[') && title.endsWith(']]>')) {
        title = title.slice(9, -3);
      }
      // Decode HTML entities
      title = decodeHtmlEntities(title);
    }
    
    // Extract link
    let link = '';
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/s);
    if (linkMatch) {
      link = linkMatch[1].trim();
    }
    
    // Extract pubDate
    let pubDate = '';
    const dateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/s);
    if (dateMatch) {
      pubDate = dateMatch[1].trim();
    }
    
    // Validate link protocol and host
    let isValidLink = false;
    let date = null;
    try {
      const url = new URL(link);
      if (url.protocol === 'https:' && (
        url.hostname === allowedHost ||
        url.hostname.endsWith('.' + allowedHost)
      )) {
        isValidLink = true;
        // Parse date
        const parsedDate = new Date(pubDate);
        if (!isNaN(parsedDate.getTime())) {
          date = parsedDate.toISOString();
        }
      }
    } catch (e) {
      // Invalid URL, skip this item
    }
    
    if (isValidLink && title) {
      items.push({
        title,
        link,
        date
      });
    }
  }
  
  return items;
}

/**
 * Fetch and parse SEN.news RSS feed
 *
 * @param {number} limit - Maximum number of items to return (default: 12)
 * @returns {Promise<Array<{title: string, link: string, date: string|null}>>}
 */
export async function getSenNews(limit = 12) {
  try {
    const response = await fetch('https://sen.news/feed/', {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'TeracomSolutionsWebsite/1.0 (+https://www.teracomsolutions.com.au)'
      }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const text = await response.text();
    return parseRssItems(text, { limit });
  } catch (error) {
    return [];
  }
}

/**
 * Decode HTML entities in a string
 *
 * @param {string} str - String with HTML entities
 * @returns {string} Decoded string
 */
function decodeHtmlEntities(str) {
  if (!str) return str;
  
  // Replace common named entities
  str = str.replace(/&amp;/g, '&');
  str = str.replace(/&lt;/g, '<');
  str = str.replace(/&gt;/g, '>');
  str = str.replace(/&quot;/g, '"');
  str = str.replace(/&#039;/g, "'");
  str = str.replace(/&#39;/g, "'");
  str = str.replace(/&#8211;/g, '–'); // en dash
  str = str.replace(/&#8212;/g, '—'); // em dash
  str = str.replace(/&#8216;/g, '‘'); // left single quotation mark
  str = str.replace(/&#8217;/g, '’'); // right single quotation mark
  str = str.replace(/&#8220;/g, '“'); // left double quotation mark
  str = str.replace(/&#8221;/g, '”'); // right double quotation mark
  
  // Replace numeric entities
  str = str.replace(/&#(\d+);/g, (match, code) => {
    // Handle special cases for common numeric entities
    if (code === '160') return ' '; // &nbsp; -> space
    return String.fromCharCode(code);
  });
  
  return str;
}