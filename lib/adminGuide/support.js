const guide = `## Support

Ask Tera, the AI support assistant for customers signed in to the website, and every conversation it has had in the last 90 days.

### How to get there

Click **Support** in the main menu.

### Who can use Tera

Only customers signed in to the website. Visitors who are not signed in see Tera's button, but it asks them to sign in or create a free account first.

### What Tera answers from

Only Teracom's own material, called the library:

- The help centre articles and their FAQs
- The free calculators, with how each one works
- The services pages
- Every published store product (name, SKU, part number, category, warranty and description)
- Every manual, datasheet and brochure published on the website (the first 40 pages of each)

The library is rebuilt every day. Click **Rebuild library** after publishing something you want Tera to know straight away; it takes about a minute.

Each answer lists the pages or documents it came from. When the library does not cover a question, Tera says so and offers **Submit a request**, so the customer reaches the team. Tera does not quote prices or delivery dates, and it sends mains electrical questions to a licensed electrician.

### Which AI writes the answers

1. A local model first, when one is set up in AI Connections with a public web address.
2. Otherwise the cloud providers in AI Connections, in their order, up to the **Cloud answers allowed per month** set on this page.
3. Once the cap is used, Tera tells customers it cannot answer right now until next month, or until the local model is reachable.

The AI governance rules apply to Tera as they do to the Assistant.

### What you see

| Item | What it shows |
|---|---|
| Library | Whether it is ready, when it was last built, and how many items and passages it holds |
| Cloud answers this month | How many answers came from a cloud AI, out of the monthly cap |
| Local model | The local model Tera uses, or a note that it is using the cloud |
| Last 30 days | Conversations, answers, the share answered from the library, and customers' ratings |
| Questions Tera could not answer | What customers asked that the library did not cover. Use it to add help articles or product details |
| Conversations | The newest first. Click one to read it, with the sources and model behind each answer |

### Keeping conversations

Conversations are deleted automatically 90 days after their last message.
`;

export default guide;