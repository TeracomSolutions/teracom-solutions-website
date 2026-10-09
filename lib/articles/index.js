// Articles on the website (Robert, 2026-10-09): original plain-English guides
// that replace the old shop's most-visited blog posts. Each article is a data
// file in this folder; the pages are app/resources/articles. A block is a
// paragraph (p), a heading (h2, h3) or a list (ul, ol) whose items are a
// sentence or a { term, text } pair.
import projectorScreenOrPlainWall from './projector-screen-or-plain-wall.js';
import whatIsAccessControl from './what-is-access-control.js';
import whatIsAnIntruderAlarmSystem from './what-is-an-intruder-alarm-system.js';
import whatIsAUps from './what-is-a-ups.js';

// Most visited old post first.
export const articles = [projectorScreenOrPlainWall, whatIsAccessControl, whatIsAnIntruderAlarmSystem, whatIsAUps];

export function getArticle(slug) {
  return articles.find((article) => article.slug === slug) || null;
}