export default `## AI Connections

The AI providers the Assistant and Scout use, the Internet in their order of preference, and the rules they all follow. The Connections tab is laid out the same as the TeracomAI Global Platform's AI Provider Connections, so settings carry across one to one.

### How to get there

Click **AI Connections** in the main menu. The page has two tabs: **Connections** and **Governance**.

### What you see

**The diagram**

The website is the router in the middle. Each connection hangs off it:

- A cloud is a hosted API somebody else runs (OpenAI (ChatGPT), Anthropic (Claude), Google Gemini and the rest)
- A rack is a model on our own hardware, such as Ollama
- The dashed cloud at the top is the Internet, where Scout finds its sources

Each shape is coloured by how that connection is doing: green Responding, red Failing, grey Disabled, amber Not checked yet. The number in front of each name is its place in the order of preference, and the bold line is the first choice. The sentence under the diagram says where the Internet sits in the order.

**The connections table**

One row per connection, in the order of preference:

| Column | What it shows |
|---|---|
| Order | The place in the order, with up and down arrows to move it |
| Provider | The name, and underneath its kind: native, hosted, self-hosted or source |
| Default model | The model it uses |
| Key | The last four characters of the stored key, host for a self-hosted model, or none needed for the Internet |
| Status | Responding, Failing (with the reason), Disabled or Not checked yet; after Check now, the answer shows underneath |
| Last message from the provider | The provider's own words when the last call failed, such as an out-of-credit or rejected-key message |
| Checked | When it last answered or failed |
| Actions | **Check now**, **Edit** and **Remove** |

**The Add New Connection form**

- Provider: grouped by what each needs: Direct SDK (an API key), Hosted API (an API key), Self-hosted (a host, no key) and Source (nothing). Providers already connected show as already connected
- Under the provider: what it is good for, and a Where the key comes from link
- Default Model: filled in from the provider's own default; change it if you want another model
- Host: only for self-hosted models, the address the model runs at
- API Key: only for providers that need one. When editing, leave it blank to keep the current key
- Enabled: untick to keep a connection but take it out of the running order
- **Add Connection** (or **Update Connection** and **Cancel** when editing)

**Rules table** (Governance tab)

Order: Buttons to move the rule up or down in the list
Rule: Title of the rule and its text, plus a description of what it does
Category: Personal details, Financial details, Passwords and keys, Conduct or Custom
Enforcement: Instruction (the rule is told to the model), Filter (the matching details are removed before reaching the provider) or Instruction and filter
Applies to: All providers, or External providers only
On: Toggle button to enable or disable the rule
Actions: Buttons to edit or delete a rule

**Add a rule form** (Governance tab)

Title: A short title for the rule (max 120 characters)
Rule: The text of the rule (max 1000 characters)
Category, Enforcement and Applies to as above
Save: Saves the new rule

**Test the filter form** (Governance tab)

Text to test: Enter text to check. The text is not stored
As sent to: Select which provider to test with
Show what the provider would receive: Runs the test and shows what was removed and what remains

### Step by step

**To add a new AI provider connection**

1. On the Connections tab, go to **Add New Connection** below the table
2. Choose the provider from the **Provider** list
3. Enter the **API Key** (or the **Host** for a self-hosted model)
4. Check the **Default Model**
5. Leave **Enabled** ticked and click **Add Connection**
6. Click **Check now** on its new row to make sure it answers

**To change a connection**

1. Click **Edit** on its row; the form below fills in
2. Change the default model, key or host (leave the key blank to keep it)
3. Click **Update Connection**

**To switch a connection or the Internet off or on**

1. Click **Edit** on its row
2. Untick or tick **Enabled**
3. Click **Update Connection**

**To change the order of preference**

1. In the table, click the up or down arrow in the **Order** column
2. The diagram and the numbers update; the new order applies from the next request

**To check a provider now**

1. Click **Check now** on its row
2. A real request is sent (for the Internet, one real search) and the answer shows under its Status

**To remove a connection**

1. Click **Remove** on its row and confirm
2. The connection and its key are deleted

**To add a governance rule**

1. On the Governance tab, go to the **Add a rule** form
2. Fill in the title, rule text, category, enforcement and applies to fields
3. Click **Add rule**

**To test the filter**

1. On the Governance tab, enter text in **Text to test**
2. Choose a provider in **As sent to**
3. Click **Show what the provider would receive**

**To switch a rule off**

1. In the rules table, click the **On** toggle for that rule

### Good to know

- API keys are stored encrypted and never shown again; the table shows only the last four characters
- ChatGPT is listed as **OpenAI (ChatGPT)**, Claude as **Anthropic (Claude)** and Grok as **xAI (Grok)**
- A ChatGPT Plus or Team subscription does not give the console access: create an API key at platform.openai.com and add prepaid credit there; Claude and Gemini work the same way with their own keys
- Microsoft Copilot and Meta AI have no key of their own to connect; their models are reached through OpenAI (ChatGPT) and through Groq, Together AI, Hugging Face or OpenRouter (Llama)
- One order of preference applies to the Assistant and to Scout. The Assistant skips the Internet; Scout critiques with a different provider from the one that researched
- Where the Internet sits matters: above the models, Scout searches the web first; below them, a model answers from its own knowledge and the web is the fallback; switched off, Scout uses the models only
- A provider that fails is skipped for that request and tried again on the next one; nothing needs resetting
- You can connect each provider once; Edit changes it
- Governance rules apply to every AI call the Assistant and Scout make
- Filters remove personal details (emails, phone numbers, addresses), financial details (card numbers, bank details, tax file numbers) or passwords and keys before anything reaches a provider

### If something goes wrong

- **Failing: out of credit** or **Failing: key rejected**
  Read the Last message from the provider, then go to that provider's own console to add credit or make a new key, and paste the new key with Edit.

- **Unable to load the AI connections from the backend.**
  Check your internet connection and try again.

- **Unable to load the governance rules from the backend.**
  Check your internet connection and try again.

- **Failed to save the AI connection.**
  Make sure the key or host is filled in, then try again.

- **Failed to delete the AI connection.**
  Check your internet connection and try again.
`;