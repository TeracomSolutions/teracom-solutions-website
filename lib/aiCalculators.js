// Maths for the AI & automation tools on /tools (Robert, 2026-11-02). Pure functions:
// field values arrive as the strings the visitor typed. No prices are built in --
// model prices change every few months, so the visitor enters today's figures.

const num = (value) => {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export const AI_TASKS = [
  { value: 'extraction', label: 'Sorting, tagging or pulling details out of emails and forms', weight: 0 },
  { value: 'chat', label: 'Answering customer or staff questions', weight: 1 },
  { value: 'writing', label: 'Writing emails, quotes, posts or documents', weight: 1 },
  { value: 'images', label: 'Reading photos, scans or camera images', weight: 1 },
  { value: 'voice', label: 'Talking on the phone or taking voice notes', weight: 1 },
  { value: 'documents', label: 'Reading long documents, contracts or manuals', weight: 2 },
  { value: 'analysis', label: 'Analysing figures, reports or research', weight: 2 },
  { value: 'coding', label: 'Writing or checking software code', weight: 2 },
  { value: 'agents', label: 'Carrying out multi-step jobs across your systems', weight: 3 },
];

export const AI_QUALITY = [
  { value: 'good', label: 'Good enough -- a person checks the answer', weight: 0 },
  { value: 'high', label: 'High -- mistakes are costly', weight: 1 },
  { value: 'critical', label: 'Critical -- complex reasoning, little room for error', weight: 2 },
];

export const AI_VOLUME = [
  { value: 'low', label: 'Under 100 a day', weight: 0 },
  { value: 'medium', label: '100 to 5,000 a day', weight: 0 },
  { value: 'high', label: 'Over 5,000 a day', weight: -1 },
];

export const AI_DATA = [
  { value: 'public', label: 'Public information only' },
  { value: 'business', label: 'Normal business information' },
  { value: 'sensitive', label: 'Personal, health or financial details' },
  { value: 'onsite', label: 'Must never leave our own premises' },
];

export const AI_SPEED = [
  { value: 'instant', label: 'Instant -- someone is waiting for the answer' },
  { value: 'relaxed', label: 'A minute or two is fine' },
];

export const AI_LENGTH = [
  { value: 'short', label: 'A page or two' },
  { value: 'long', label: 'Long -- 50 pages or more at a time' },
];

const TIERS = {
  small: {
    name: 'Small, fast model',
    examples: 'Claude Haiku, the GPT mini models or Gemini Flash',
    why: 'Cheap and quick for simple, repeatable work. Paying for a bigger model here buys little.',
  },
  balanced: {
    name: 'Mid-size, all-round model',
    examples: 'Claude Sonnet, the standard GPT models or Gemini Pro',
    why: 'The best balance of quality, speed and cost for most business work.',
  },
  frontier: {
    name: 'Most capable model',
    examples: 'Claude Opus or the top GPT and Gemini models',
    why: 'Worth the higher cost when the work needs careful reasoning over many steps or a mistake is expensive.',
  },
};

const ONSITE_EXAMPLES = {
  small: 'A small open-weight model (around 4 to 14 billion parameters), such as the smaller Qwen, Llama or Gemma models',
  balanced: 'A mid-size open-weight model (around 27 to 70 billion parameters), such as Qwen, Llama or Mistral',
  frontier: 'The largest open-weight model your server can hold (100 billion parameters or more)',
};

const isOnsite = (value) => value === 'onsite';

const pick = (list, value) => list.find((o) => o.value === value) || list[0];

export function aiModelPicker(v) {
  const task = pick(AI_TASKS, v.task);
  const quality = pick(AI_QUALITY, v.quality);
  const volume = pick(AI_VOLUME, v.volume);
  const data = pick(AI_DATA, v.data).value;
  const speed = pick(AI_SPEED, v.speed).value;
  const length = pick(AI_LENGTH, v.length).value;

  let score = task.weight + quality.weight + volume.weight;
  if (speed === 'instant') score -= 0.5;
  if (length === 'long') score += 0.5;
  const tierId = score <= 1 ? 'small' : score <= 3 ? 'balanced' : 'frontier';
  // Kept on site, the same sizes come from open-weight models run on your own server.
  const tier = isOnsite(v.data) ? { ...TIERS[tierId], examples: ONSITE_EXAMPLES[tierId] } : TIERS[tierId];

  let where;
  if (data === 'onsite') where = 'On your own server, with a graphics card that has enough memory for the model';
  else if (data === 'sensitive') where = 'A business cloud service with an Australian data region and a written promise not to train on your data, or your own server';
  else if (data === 'business') where = 'A business (API or team) plan that does not train on your data';
  else where = 'Any reputable cloud service';

  const tips = [];
  if (data === 'onsite') {
    tips.push(
      tierId === 'frontier'
        ? 'Open-weight models you run yourself still trail the best cloud models on the hardest work. Use the largest model your server can hold, and keep a person checking the results.'
        : 'Size the server with the Virtual Server and PC Power Supply calculators, and allow for a graphics card with enough memory for the model.',
    );
  }
  if (length === 'long') tips.push('Choose a model with a large context window (200,000 tokens or more), or have it search your documents instead of reading them whole.');
  if (task.value === 'images') tips.push('Check the model accepts images; most current mid-size and larger models do.');
  if (task.value === 'voice') tips.push('Voice needs a speech service on each side of the model; test it with real Australian accents and background noise.');
  if (task.value === 'agents') tips.push('Give it read-only access first, and have a person approve anything that changes records, sends messages or spends money.');
  if (volume.value === 'high' && tierId !== 'small') tips.push('At this volume, send the easy requests to a small model and only the hard ones to the bigger one. It can cut the bill by more than half.');
  if (speed === 'instant' && tierId === 'frontier') tips.push('The most capable models are slower. Where someone is waiting, show the answer as it is written, or use a mid-size model for the first reply.');

  return { tierId, tier, where, tips, score };
}

export function aiTokenCost(v) {
  const requestsPerDay = num(v.requestsPerDay);
  const days = num(v.daysPerMonth);
  const inputTokens = num(v.inputTokens);
  const outputTokens = num(v.outputTokens);
  const inputPrice = num(v.inputPricePerMillion);
  const outputPrice = num(v.outputPricePerMillion);
  const audPerUsd = num(v.audPerUsd) || 1;
  const cachedShare = Math.min(num(v.cachedPercent), 100) / 100;

  const requests = requestsPerDay * days;
  const inputMonth = requests * inputTokens;
  const outputMonth = requests * outputTokens;
  // Cached input is typically billed at about a tenth of the normal input rate.
  const inputCost = (inputMonth * (1 - cachedShare) * inputPrice + inputMonth * cachedShare * inputPrice * 0.1) / 1e6;
  const outputCost = (outputMonth * outputPrice) / 1e6;
  const usd = inputCost + outputCost;
  const aud = usd * audPerUsd;
  return {
    requests,
    tokensMonth: inputMonth + outputMonth,
    usd,
    aud,
    audYear: aud * 12,
    audPerRequest: requests ? aud / requests : 0,
    outputShare: usd ? outputCost / usd : 0,
  };
}

export function aiAutomationSavings(v) {
  const tasks = num(v.tasksPerMonth);
  const before = num(v.minutesBefore);
  const after = Math.min(num(v.minutesAfter), before);
  const hourly = num(v.hourlyCost);
  const running = num(v.monthlyRunningCost);
  const setup = num(v.setupCost);

  const hoursSaved = (tasks * (before - after)) / 60;
  const gross = hoursSaved * hourly;
  const net = gross - running;
  return {
    hoursSaved,
    fteShare: hoursSaved / 152,
    gross,
    net,
    paybackMonths: net > 0 ? setup / net : Infinity,
    firstYear: net * 12 - setup,
  };
}
