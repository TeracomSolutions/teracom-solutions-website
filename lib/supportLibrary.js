// What the website gives Ask Tera's library: the help centre, the free
// calculators, the services and the brands, as plain text with a link back
// to each.
// The backend reads it from /api/support/library every night
// (teracom-website-backend services/support_library.py).
import { brands } from './brands.js';
import { helpCenterTopics } from './helpCenterTopics.js';
import { services } from './services.js';
import { tools } from './tools.js';

const joinText = (parts) => parts.filter(Boolean).join(' ');

export function helpItems(origin) {
  return helpCenterTopics.map((topic) => ({
    type: 'help',
    key: topic.slug,
    title: topic.title,
    url: `${origin}/resources/help-centre#${topic.slug}`,
    content: joinText([topic.intro, ...(topic.faqs || []).map((f) => `${f.q} ${f.a}`)]),
  }));
}

export function toolItems(origin) {
  return tools.map((tool) => ({
    type: 'tool',
    key: tool.slug,
    title: tool.title,
    url: `${origin}/tools/${tool.slug}`,
    content: joinText([`${tool.title}.`, tool.description, tool.howItWorks]),
  }));
}

export function serviceItems(origin) {
  return services.map((service) => ({
    type: 'service',
    key: service.slug,
    title: service.title,
    url: `${origin}/services/${service.slug}`,
    content: joinText([service.description, service.lead, ...(service.intro || []), ...(service.includes || [])]),
  }));
}

export function brandItems(origin) {
  return brands.map((brand) => ({
    type: 'brand',
    key: brand.slug,
    title: brand.name,
    url: `${origin}/brands/${brand.slug}`,
    content: joinText([
      `${brand.name}: ${brand.tagline}`,
      brand.body,
      ...(brand.highlights || []).map((h) => `${h.title}: ${h.body}`),
      `Teracom Solutions works with ${brand.name}`,
    ]),
  }));
}

export function supportLibraryItems(origin) {
  return [...helpItems(origin), ...toolItems(origin), ...serviceItems(origin), ...brandItems(origin)];
}