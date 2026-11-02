// Field/result definitions for the AI & automation tools, rendered by
// components/tools/ConfigCalculator.js. The maths is in lib/aiCalculators.js.
import { fmt } from '@/lib/calcFormat';
import {
  AI_DATA,
  AI_LENGTH,
  AI_QUALITY,
  AI_SPEED,
  AI_TASKS,
  AI_VOLUME,
  aiAutomationSavings,
  aiModelPicker,
  aiTokenCost,
} from '@/lib/aiCalculators';

const options = (list) => list.map(({ value, label }) => ({ value, label }));
const money = (n, dp = 0) => `$${fmt(n, dp)}`;

export const aiToolConfigs = {
  'ai-model-picker': {
    fields: [
      { id: 'task', label: 'What will the AI mostly do?', type: 'select', default: 'chat', options: options(AI_TASKS) },
      { id: 'quality', label: 'How good does the answer have to be?', type: 'select', default: 'high', options: options(AI_QUALITY) },
      { id: 'volume', label: 'How many requests?', type: 'select', default: 'medium', options: options(AI_VOLUME) },
      { id: 'data', label: 'What information will it see?', type: 'select', default: 'business', options: options(AI_DATA) },
      { id: 'speed', label: 'How fast does it need to answer?', type: 'select', default: 'instant', options: options(AI_SPEED) },
      { id: 'length', label: 'How much does it read at once?', type: 'select', default: 'short', options: options(AI_LENGTH) },
    ],
    compute: (v) => aiModelPicker(v),
    results: (r) => [
      { label: 'Model size to start with', value: r.tier.name },
      { label: 'Examples', value: r.tier.examples },
      { label: 'Why', value: r.tier.why },
      { label: 'Where it should run', value: r.where },
      ...r.tips.map((tip) => ({ label: 'Tip', value: tip })),
    ],
    note: 'Models change every few months, so treat the names as examples of a size, not a recommendation of one product. Before you commit, try the top two on 20 of your own real examples and compare the answers, the speed and the bill.',
  },

  'ai-token-cost-calculator': {
    fields: [
      { id: 'requestsPerDay', label: 'Requests a day', type: 'number', default: '500', step: '10', hint: 'One question and its answer, one email drafted, one document summarised.' },
      { id: 'daysPerMonth', label: 'Days a month', type: 'number', default: '22', step: '1' },
      { id: 'inputTokens', label: 'Tokens in per request', type: 'number', default: '1500', step: '100', hint: 'Everything the model reads: instructions, the question and any documents. A token is about three-quarters of a word.' },
      { id: 'outputTokens', label: 'Tokens out per request', type: 'number', default: '400', step: '50', hint: 'The length of the answer. 400 tokens is about 300 words.' },
      { id: 'inputPricePerMillion', label: 'Price in, per million tokens (US$)', type: 'number', default: '3', step: '0.05', hint: "From the provider's pricing page. Prices change often, so check them." },
      { id: 'outputPricePerMillion', label: 'Price out, per million tokens (US$)', type: 'number', default: '15', step: '0.05' },
      { id: 'cachedPercent', label: 'Share of input that is cached (%)', type: 'number', default: '0', step: '5', hint: 'Instructions repeated on every request can be cached and are billed at about a tenth of the price.' },
      { id: 'audPerUsd', label: 'Australian dollars per US dollar', type: 'number', default: '1.55', step: '0.01' },
    ],
    compute: (v) => aiTokenCost(v),
    results: (r) => [
      { label: 'Requests a month', value: fmt(r.requests, 0) },
      { label: 'Tokens a month', value: `${fmt(r.tokensMonth / 1e6, 1)} million` },
      { label: 'Monthly cost', value: `${money(r.aud, 2)} AUD (US${money(r.usd, 2)})` },
      { label: 'Cost per request', value: `${fmt(r.audPerRequest * 100, 2)} cents` },
      { label: 'Yearly cost', value: `${money(r.aud * 12)} AUD` },
      { label: 'Share of the bill from answers', value: `${fmt(r.outputShare * 100, 0)}%` },
    ],
    note: 'Excludes GST, the cost of any tools or searches the model uses, and retries. Agents that work through several steps re-read their notes each step, so their token use can be five to twenty times a single question.',
  },

  'ai-automation-savings-calculator': {
    fields: [
      { id: 'tasksPerMonth', label: 'How often the task happens a month', type: 'number', default: '400', step: '10' },
      { id: 'minutesBefore', label: 'Minutes it takes now', type: 'number', default: '12', step: '1' },
      { id: 'minutesAfter', label: 'Minutes with AI, including checking', type: 'number', default: '3', step: '1', hint: 'Be honest: include reading the result, fixing it and handling the odd case it gets wrong.' },
      { id: 'hourlyCost', label: 'Cost of an hour of staff time ($)', type: 'number', default: '55', step: '1', hint: 'Wage plus super, leave and overheads.' },
      { id: 'monthlyRunningCost', label: 'AI running cost a month ($)', type: 'number', default: '150', step: '10', hint: 'Subscriptions plus usage. The AI Token Cost Calculator works out usage.' },
      { id: 'setupCost', label: 'One-off setup cost ($)', type: 'number', default: '3000', step: '100' },
    ],
    compute: (v) => aiAutomationSavings(v),
    results: (r) => [
      { label: 'Staff hours saved a month', value: `${fmt(r.hoursSaved, 1)} h (${fmt(r.fteShare * 100, 0)}% of a full-time person)` },
      { label: 'Value of the time saved a month', value: money(r.gross) },
      { label: 'Net saving a month', value: money(r.net) },
      { label: 'Pays for itself in', value: Number.isFinite(r.paybackMonths) ? `${fmt(r.paybackMonths, 1)} months` : 'Never, at these figures' },
      { label: 'First year, after setup', value: money(r.firstYear) },
      ...(r.net <= 0 ? [{ warn: 'The running cost is more than the time saved. Pick a bigger task, a cheaper model, or leave this one to people.' }] : []),
    ],
    note: 'Time saved only becomes money when it is used for something else. Measure a real week before and after rather than trusting the estimate.',
  },
};
