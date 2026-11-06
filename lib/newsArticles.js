// Articles drafted from industry news and published by staff (backend
// services/news_articles.py), in the shape of the built-in articles (lib/articles) so the
// same pages show both. The body is paragraphs separated by a blank line; a paragraph
// starting "## " is a heading. Pure, so the plain Node test runner can load it.

export function blocksFromBody(body = '') {
  return String(body)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .flatMap((p) => {
      // A heading line may run straight into its paragraph without a blank line.
      if (!p.startsWith('## ')) return [{ type: 'p', text: p.replace(/\s*\n\s*/g, ' ') }];
      const [heading, ...rest] = p.split('\n');
      const text = rest.join(' ').replace(/\s+/g, ' ').trim();
      return [{ type: 'h2', text: heading.slice(3).trim() }, ...(text ? [{ type: 'p', text }] : [])];
    });
}

export function articleFromNews(row) {
  if (!row || !row.slug || !row.title) return null;
  return {
    slug: row.slug,
    title: row.title,
    description: row.summary || '',
    published: (row.published_at || row.created_at || '').slice(0, 10),
    blocks: blocksFromBody(row.body),
    related: [{ label: 'Industry news', href: '/resources/industry-news' }],
    source: row.source_url ? { title: row.source_title, url: row.source_url, name: row.source_name } : null,
    industry: row.industry || '',
    fromNews: true,
  };
}
