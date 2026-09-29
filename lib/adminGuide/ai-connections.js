export default `## AI Connections

The AI providers the Assistant and Scout use, the Internet in their order of preference, and the rules they all follow.

### How to get there

Click **AI Connections** in the main menu.

### What you see

**Configured providers table**

The first table shows all the AI providers that are currently set up.

Provider: The name of the AI service (like OpenAI (ChatGPT), Anthropic (Claude), Ollama)
Key: Shows the last four characters of the API key, or a dash if not configured
Host: For self-hosted models, shows the host address. Shows a dash if not set
Default model: The default model name to use for this provider, or a dash if not set
Enabled: Shows either "Enabled" (green) or "Disabled" (red)
Updated: When the connection was last updated
Actions: Buttons to disable or **Remove** a connection

**Add or update a provider form**

This form allows you to add new providers or change existing ones.

Provider: Select the AI service from the dropdown list. Options are grouped into:
Hosted APIs (OpenAI (ChatGPT), Google Gemini, xAI (Grok), Mistral, DeepSeek, Perplexity, Cohere, Alibaba Qwen, Moonshot Kimi and more)
Self-hosted (Ollama, LM Studio, vLLM)
API key: Enter the API key for hosted providers. Leave blank to keep the current key.
Host: For self-hosted providers, enter the host address. Required when adding a new one.
Default model: Optional. Enter the default model name to use with this provider.
Get a key link: A link that opens in a new tab showing where to get an API key
Save: Saves your changes for the selected provider
Save: Adds a new provider connection

**What you can connect table**

This table shows all available providers that can be added.

Provider: Name of the AI service (like OpenAI (ChatGPT), Anthropic (Claude))
Kind: Type of provider:
Native API
Hosted API (key)
Self-hosted (host)
Good for: Description of what the provider is good for
Default model: The default model name, or a dash if not set
Status: Shows one of three statuses:
Connected (green)
Disabled (red)
Not connected (amber)
Action: Button to set up a connection with that provider

**Rules table**

This shows all governance rules currently in place.

Order: Buttons to move the rule up or down in the list
Rule: Title of the rule and its text, plus a description of what it does
Category: One of:
Personal details
Financial details
Passwords and keys
Conduct
Custom
Enforcement: How the rule is applied. Options are:
Instruction: The rule is told to the model
Filter: The matching details are removed before reaching the provider
Instruction and filter: Both of the above
Applies to: Where the rule applies. Options are:
All providers
External providers only
On: Toggle button to enable or disable the rule
Actions: Buttons to edit or delete a rule

**Add a rule form**

This form adds a new governance rule.

Title: A short title for the rule (max 120 characters)
Rule: The text of the rule (max 1000 characters)
Category: Select one of the categories listed above
Enforcement: How to enforce the rule (Instruction, Filter or Instruction and filter)
Applies to: Where the rule applies (All providers or External providers only)
Save: Saves the new rule

**Test the filter form**

This allows you to see what a provider would receive after filtering.

Text to test: Enter text to check. The text is not stored
As sent to: Select which provider to test with
Show what the provider would receive: Runs the test and shows results
Result display: Shows what was removed from your text and what remains

**Order of preference**

The order of providers in the routing picture determines which ones Scout tries first. The Assistant and Scout try the first enabled provider and fall back to the next.

The up and down arrows change the order of preference for the providers.

The Internet is a special connection that Scout uses for web search. It sits in the Order of preference like a provider: above the models, Scout searches the web first; below them, the first model answers from its own knowledge and the web is the fallback; switched off, Scout uses the models only.

**Internet**

Switch on / Switch off: Toggle the Internet on or off
Check now: Runs one real search to check the Internet connection

### Step by step

**To add a new AI provider connection**

1. Click on the **Add a provider** form
2. Select the provider from the dropdown list
3. Enter the API key for hosted providers or host address for self-hosted ones
4. Optionally enter a default model name
5. Click **Save**

**To change an existing AI provider connection**

1. In the **Add or update a provider form**, select the provider from the dropdown list (or keep the same one)
2. Enter a new API key or host address if needed
3. Optionally update the default model name
4. Click **Save**

**To enable or disable an AI provider**

1. In the configured providers table, click **Enable** or **Disable** for that provider
2. The status will change in the table

**To change the order of preference**

1. In the **Order of preference** list, click the up or down arrow next to a provider
2. The provider will move up or down in the list
3. The new order applies from the next request

**To switch the Internet on or off**

1. In the Order of preference list, click **Switch on** or **Switch off** for the Internet row
2. The status will change in the table

**To check a provider now**

1. In the configured providers table, click **Check now** for that provider
2. A real request is sent to that provider and its response time or error is shown

**To add a governance rule**

1. Click on the **Add a rule** form
2. Fill in the title, rule text, category, enforcement and applies to fields
3. Click **Add rule**

**To test the filter with Show what the provider would receive**

1. Enter text to check in the **Text to test** field
2. Select which provider to test with in the **As sent to** dropdown
3. Click **Show what the provider would receive**
4. The result display shows what was removed and what remains

**To switch a rule off**

1. In the rules table, click the **On** or **Off** toggle button for that rule
2. The status will change in the table

### Good to know

- API keys are stored encrypted and never shown again
- ChatGPT is listed as **OpenAI (ChatGPT)**, Claude as **Anthropic (Claude)** and Grok as **xAI (Grok)**
- A ChatGPT Plus or Team subscription does not give the console access: create an API key at platform.openai.com and add prepaid credit there; Claude and Gemini work the same way with their own keys
- Microsoft Copilot and Meta AI have no key of their own to connect; their models are reached through OpenAI (ChatGPT) and through Groq, Together AI, Hugging Face or OpenRouter (Llama)
- When you add a new connection, it starts enabled by default
- You can only connect one AI provider of each type at a time
- The order of providers in the routing picture determines which ones Scout tries first
- Governance rules apply to all AI calls made by the Assistant and Scout
- Filters remove personal details (emails, phone numbers, addresses), financial details (card numbers, bank details, tax file numbers) or passwords and keys from information before it reaches a provider

### If something goes wrong

- **Unable to load the AI connections from the backend.**
  Check your internet connection and try again.

- **Unable to load the governance rules from the backend.**
  Check your internet connection and try again.

- **Unable to save the connection.**
  Make sure all required fields are filled in correctly.

- **Unable to update the connection.**
  Try again or check that the connection details are correct.

- **Unable to remove the connection.**
  Check your internet connection and try again.
`