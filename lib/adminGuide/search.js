export default `## Search

Google still shows people addresses from the old website, and those pages no longer exist, so a visitor who clicks one sees "not found". This page lists those old addresses and the page on this website each one now goes to. A redirect sends the visitor, and Google, from the old address to the new page, so the visit and the search ranking are not lost.

### How to get there

Click **Search** in the main menu, between Scout and Social.

### Where the list comes from

The list comes from Google Search Console, which you connected under **Connections**. Once a week, and whenever you press **Search now**, the website asks Google which of its pages it showed people over the last 90 days, checks each one, and for every page that says not found it works out the page it belongs on:

- An old category or brand page goes to the category or brand of the same name.
- The old shop's own pages, such as Contact us, About us and Returns policy, go to their replacements.
- An old product page goes to the product whose part number people searched for to reach it, or to the brand's page when only the brand is clear.
- Old manuals and data sheets go to their brand's page, or to the manuals in Resources.
- Old FAQ pages and blog posts go to Resources until the articles themselves are brought back.

Every guess is checked first: a redirect never points at a page that does not work.

### What you see

**The tabs**

| Tab | What it holds |
|-----|---------------|
| Waiting for a yes | Guesses that are not close enough to go live by themselves. Look at these. |
| Live | Redirects that are on now, whether they went live by themselves or you approved them. |
| Rejected | Old addresses you set aside. They keep saying not found. |

The number beside each tab is how many redirects it holds.

**How sure each guess is**

| Label | Meaning |
|-------|---------|
| Sure | The old address is a category, a brand or one of the old shop's own pages. Goes live by itself. |
| Strong guess | The old address names a brand or category among other words, or people reached it by searching for a product's part number. Goes live by itself. |
| Brand page | People reached the old page by searching for a brand, so it goes to that brand. Goes live by itself. |
| Possible | A part number was in a less common search, so the match may be wrong. Waits for your yes. |
| General page | No closer match was found, so it goes to the Store or Resources. Waits for your yes. |

**The columns**

- **Old address** is the address Google shows, with how many times Google showed it and how many clicks it got in the last 90 days, and the search people used most to reach it.
- **Goes to** is the page on this website. Click it to open it.
- **Why** says how sure the guess is and the reason for it.

### Step by step

**To look at what is waiting**
1. Open **Search**. The Waiting for a yes tab opens first.
2. Read down the list, starting with the most viewed at the top.
3. Click **Approve** on the ones that are right, **Change** on the ones that need a different page, and **Reject** on the ones that should be left alone.

**To approve many at once**
1. Tick the redirects you agree with, or press **Select all**.
2. Press **Approve selected** (or **Reject selected**).

**To send an old address to a different page**
1. Press **Change** on its row.
2. Type the page on this website, starting with a slash, for example /store/cctv.
3. Press **Save**. The redirect turns on straight away.

**To turn a live redirect off**
1. Open the **Live** tab.
2. Press **Turn off** on its row. It moves to Rejected.

**To look again**
1. Press **Search now**. It takes a few minutes. Press **Refresh** to see what it found.

### Things to know

- A redirect you have approved, changed or rejected is never changed by a later search. Only the view and click figures are updated.
- Redirects are permanent (the website tells Google the page has moved for good), and take effect within about five minutes of being turned on.
- Search now needs the Google connection under **Connections** to be working. If it is not, this page says so.
- A General page guess is better than a dead end, but Google may treat many of them as "soft not found". Where you know the right page, use **Change**.
`;
