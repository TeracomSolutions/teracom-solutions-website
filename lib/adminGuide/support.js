const guide = `## Support

Ask Tera, the AI support assistant for anyone signed in to the website or the console: what it knows, what you have taught it, and every conversation it has had in the last 90 days.

### How to get there

Click **Support** in the main menu.

### Who can use Tera

Customers signed in to the website, and staff signed in to the console. Visitors who are not signed in see Tera's button, but it asks them to sign in or create a free account first.

### What Tera answers from

Only Teracom's own material, called the library:

- The help centre articles and their FAQs
- The free calculators, with how each one works
- The services and brands pages
- Every published store product (name, SKU, part number, category, warranty and description)
- Every product in the suppliers' latest price lists that the store does not show, as one Teracom can order in. No prices, stock or supplier names
- Every manual, datasheet and brochure published on the website (the first 40 pages of each)
- What staff taught Tera and the answers it learned (see Teach Tera below), searched before everything else

The library is rebuilt every day. Click **Rebuild library** after publishing something you want Tera to know straight away; it takes about a minute.

Each answer lists the pages or documents it came from. When the library does not cover a question, Tera says so and offers **Submit a request**, so the customer reaches the team. When a question names a brand Tera has never heard of, it says so by name. Tera does not quote prices or delivery dates, does not work out sums itself (it points to the right calculator), and it sends mains electrical questions to a licensed electrician.

### Manufacturers' websites

When the library has nothing on a question, Tera may search the web, but it only reads pages on the manufacturers' websites listed in **Settings**, or on a site named after a brand it has never heard of (kantech.com for Kantech). Answers from those pages say they came from the manufacturer's website. Untick **Read manufacturers' websites** in Settings to stop it.

### Draft replies and handovers

When Tera cannot answer in the chat, the customer can send the question to the team (weekdays 9am to 4:30pm) or ask for a callback (outside those hours). Either way it arrives on the **Leads** page and emails sales, and Tera drafts a reply, as it does for every new enquiry. Check it and press Send on the Leads page; nothing goes to a customer until you do.

Untick **Tera drafts a reply to every new enquiry** in Settings to stop the drafts. The **Draft replies** figure shows how many went out as Tera wrote them, how many were changed first, and how many were discarded.

### Teach Tera

1. Under **Teach Tera**, type a question the way a customer would ask it, and the answer Tera should give.
2. Click **Teach Tera**. Tera uses it straight away, ahead of everything else in the library.
3. Under **Questions Tera could not answer**, click **Teach Tera this** to start with that question already filled in.

Tera also learns from its own chats:

- An answer a customer rates helpful is kept.
- In a conversation, click **Keep this answer** under a good answer to keep it.
- Just before a conversation is deleted after 90 days, every answer nobody rated not helpful is kept.

Card numbers, keys, phone numbers, email and street addresses are taken out before anything is kept. Each item shows as **Taught** or **Learned**. Click **Edit** to change one, **Switch off** to stop Tera using it, or **Delete**. An answer a customer later rates not helpful is switched off by itself.

### Which AI writes the answers

1. Tera's own model on this server first (Ollama, set in **Settings**), so questions stay on Teracom's server. It reads only the key sentences of the best two matches, and its answer appears word by word as it is written. If it goes 20 seconds without writing, the next model answers. A question that is nearly the same as one you taught Tera, or one it learned, is answered straight away without any model.
2. Then a local model set up in AI Connections with a public web address, if there is one.
3. Otherwise the cloud providers in AI Connections, in their order, up to the **Cloud answers allowed per month** set in **Settings**.
4. Once the cap is used, Tera tells customers it cannot answer right now until next month, or until its own model is back.

The AI governance rules apply to Tera as they do to the Assistant.

### What you see

| Item | What it shows |
|---|---|
| Library | Whether it is ready, when it was last built, and how many items and passages it holds |
| Cloud answers this month | How many answers came from a cloud AI, out of the monthly cap |
| Local model | The local model Tera uses, or a note that it is using the cloud |
| What Tera knows | How many answers staff taught it and how many it learned from chats |
| Last 30 days | Conversations, answers, the share answered from the library, and customers' ratings |
| Questions Tera could not answer | What customers asked that the library did not cover. Use it to add help articles or product details |
| Teach Tera | Everything taught or learned, with Edit, Switch off and Delete |
| Conversations | The newest first. Click one to read it, with the sources and model behind each answer, and **Keep this answer** under good ones |
| Settings | The cloud cap, Tera's own model, and the manufacturers' websites it may read |

### Keeping conversations

Conversations are deleted automatically 90 days after their last message. What Tera learned from them stays.
`;

export default guide;