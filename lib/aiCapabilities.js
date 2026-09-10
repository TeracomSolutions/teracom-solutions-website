// Teracom AI capability detail content. Each entry here gets its own page
// at /securityos-ai/<slug>, linked from both the homepage's "Available now"
// section and the dedicated /securityos-ai capabilities grid. Only real,
// already-shipped capabilities are listed here (matches what's described
// on /securityos-ai/page.js) -- the "coming soon" future modules
// (FinanceOS, OperationsOS, ElectricalOS) stay as plain badges on the
// homepage rather than getting a detail page, since there's no real
// feature content to describe for those yet.
export const aiCapabilities = [
  {
    slug: 'ai-support-agents',
    title: 'AI Support Agents',
    summary: 'Product-specific assistants for platforms including Tecom Challenger, Gallagher, Genetec, Milestone, Inner Range and HID.',
    description:
      'Instead of digging through manuals or waiting on a callback, technicians and engineers can ask a Teracom AI support agent directly -- configuration steps, programming, troubleshooting, and how a specific feature actually behaves in the field. Each agent is scoped to the platforms Teracom works with every day, so answers are grounded in real product knowledge rather than generic search results.',
    benefits: [
      'Faster answers on-site, without waiting for a callback',
      'Covers the specific platforms your team actually installs and services',
      'Reduces repeat questions landing on your most experienced technicians',
    ],
  },
  {
    slug: 'scope-of-works-generation',
    title: 'Scope of Works Generation',
    summary: 'Create structured scopes, technical inclusions, exclusions and solution descriptions faster.',
    description:
      'Turning a site brief or a client conversation into a properly structured Scope of Works takes time, and it is easy for details to get missed or worded inconsistently between projects. Teracom AI helps build that structure -- inclusions, exclusions, technical detail and a clear solution description -- so the result reads consistently no matter who on the team put it together.',
    benefits: [
      'Consistent scope documents across the whole team, not just your best writer',
      'Fewer missed inclusions/exclusions that turn into disputes later',
      'A faster path from client brief to a document you can actually send',
    ],
  },
  {
    slug: 'estimation-assistance',
    title: 'Estimation Assistance',
    summary: 'Turn requirements into clearer estimate-ready details and practical solution summaries.',
    description:
      'Estimators spend a lot of their time interpreting requirements before they can even start pricing. Teracom AI helps turn a set of raw requirements into a clear, structured, estimate-ready summary -- so the time your estimators spend is on getting the number right, not on decoding what was actually asked for.',
    benefits: [
      'Less time spent interpreting requirements before pricing can start',
      'More consistent estimate structure across different jobs and estimators',
      'Clearer handover between whoever scoped the job and whoever prices it',
    ],
  },
  {
    slug: 'tender-response-support',
    title: 'Tender Response Support',
    summary: 'Draft consistent technical responses, compliance content and project documentation.',
    description:
      'Tender submissions are repetitive by nature -- similar compliance requirements, similar technical narrative, different project each time. Teracom AI helps draft that technical response content and supporting documentation, so your team spends more of a tender deadline refining the pitch and less of it starting from a blank page.',
    benefits: [
      'Faster first drafts of technical response content',
      'More consistent quality across multiple simultaneous submissions',
      'More time before a deadline actually spent on strategy, not typing',
    ],
  },
  {
    slug: 'technical-design-guidance',
    title: 'Technical Design Guidance',
    summary: 'Support around product fit, architecture, integration pathways, network considerations and deployment planning.',
    description:
      'Before a design is locked in, it helps to have a second opinion grounded in real product knowledge -- whether a given product actually fits the requirement, how an integration pathway is likely to behave, or what network considerations get missed until commissioning day. Teracom AI is there to sanity-check design decisions against real-world product and deployment experience.',
    benefits: [
      'A second opinion on product fit before a design is locked in',
      'Fewer integration surprises discovered during commissioning',
      'Design guidance grounded in how these products actually behave in the field',
    ],
  },
  {
    slug: 'training-and-knowledge-tools',
    title: 'Training & Knowledge Tools',
    summary: 'Build structured technical learning and knowledge resources for technicians and project teams.',
    description:
      'A lot of technical knowledge ends up living in one or two people’s heads rather than somewhere the wider team can access it. Teracom AI helps turn that knowledge into structured training material and reference content, so new technicians ramp up faster and the business is not exposed every time someone experienced takes leave -- or moves on.',
    benefits: [
      'Faster onboarding for new technicians and project staff',
      'Institutional knowledge captured somewhere the whole team can reach it',
      'Less reliance on any single person being available to answer a question',
    ],
  },
];

export function findAiCapability(slug) {
  return aiCapabilities.find((c) => c.slug === slug);
}
