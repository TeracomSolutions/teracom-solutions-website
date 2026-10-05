export default `## Assistant

The assistant helps staff manage the console using plain English. You can ask it to look up information, change settings, or run tasks. It follows the same actions as if you clicked through the pages yourself, so everything it does is logged in the audit trail.

### How to get there
Click **Assistant** in the main menu.

### What you see
The assistant chat interface has these parts:

**Chat log area**
Shows your questions and replies from the assistant
For each reply, lists the actions it took (like "Set Gold tier to 12% on cost")
Shows a status indicator: Ready, Listening..., Thinking..., Speaking...
When no conversation has started, shows suggested questions below

**Input area**
Text box for typing your question
Microphone button for voice input
Send button to submit your question
New conversation button to start over

**Voice settings**
"Send when I stop talking" checkbox
"Read replies aloud" checkbox

**Suggested questions**
Shows 6 example questions you can try
Click any suggestion to use it as your input

**What the assistant can do**
Suppliers and price lists: list suppliers, show when each was last imported, search the catalogue
Pricing: read or set the Member, Silver, Gold and Platinum markups on cost and per-supplier markups
Scout: list tasks and the review queue, create a task, start research
Resources: list watched websites, add one, run a check now
Leads: list new enquiries, summarise them, mark one contacted
Website data: visitor numbers and top pages for a period

### Hold a conversation
Click **Hold a conversation**, beside Speak, to talk with the assistant out loud, back and forth, without touching the keyboard. It turns on Send when I stop talking and Read replies aloud for you, then listens, sends what you said when you pause, speaks the answer and listens again. In this mode answers are kept to a few short sentences and may end with a question back to you. It needs Chrome or Edge, and the browser asks to use your microphone the first time.

To finish, say that is all, goodbye or stop, click **End conversation**, or stay quiet for three rounds in a row. Your Read replies aloud setting goes back to what it was.

### What the assistant knows
With every question the console searches this guide and the help behind the ? icon on every page, and gives the assistant the passages that match. So it can answer how a setting works, what a button does, what a field means and where to find something. It also keeps the whole guide to look things up in. If the help does not cover something it says it is not sure rather than guessing. It keeps nothing between conversations except what is said in the current one.

### Step by step

**To ask a question about suppliers and price lists**
1. Type or say "Which suppliers have never had a price list imported?"
2. Press Enter or click Send
3. The assistant replies with the list of suppliers

**To set a pricing tier**
1. Type or say "Set the Gold tier to 12% on cost."
2. Press Enter or click Send
3. The assistant confirms the change and shows what it did in the actions list

**To create a Scout task**
1. Type or say "Create a weekly Scout task: what are competitors charging for Hikvision 8MP turret cameras in Australia?"
2. Press Enter or click Send
3. The assistant creates the task and shows the action it took

**How it works**

The assistant uses the AI connections under AI Connections in the order of preference set there (the first that answers is used). Each reply says which one answered.

### Good to know

It cannot delete anything, upload files, change AI keys, or edit the website itself
Each reply lists the actions it took so nothing happens silently
The assistant runs on the same backend as the admin pages
Voice input works in Chrome and Edge browsers only
Read replies aloud uses your browser's own speech synthesis
Conversations are not saved; the conversation is cleared when you leave or reload the page

**Voice input needs Chrome or Edge.**

### If something goes wrong**

"The assistant did not answer." - Try again or check the AI connection status
"Voice input stopped: [error]." - Check browser compatibility (Chrome or Edge required)
"[Error message from backend]" - This shows any specific error from the system when processing your request`
