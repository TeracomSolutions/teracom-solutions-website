# Savings pages: Australian Consumer Law review (3 November 2026)

Pages reviewed (drafts, not public): `/teracom-ai/savings` and `/teracom-ai/departments/finance` (open with `?preview=1`), plus the live Teracom AI store pages (`/store/teracom-ai`, `/store/teracom-ai/<pack>`).

This is a plain-English compliance review by the website team, written so a solicitor can sign it off quickly. It is not legal advice. The brief (teracom-ai-docs `Workstreams/WEBSITE_VALUE_AND_SAVINGS_V1.md`) asks for a legal review before anything goes live; that sign-off is still needed.

## The rules that apply

- **Misleading or deceptive conduct (ACL s18)** and **false or misleading representations (s29)**: judged by the overall impression on an ordinary reader, including the headline, not only the small print.
- **Representations about future matters (s4)**: a claim about what will happen (a future saving, a payback period) is taken to be misleading unless the business had reasonable grounds for it when it was made. Teracom has no measured customer results yet, so the pages must not state or imply that a saving will happen.
- **Qualifications and disclaimers**: a disclaimer cannot correct a headline that misleads; the qualification has to be as prominent as the claim (ACCC guidance on fine print and "up to" claims).
- **Availability**: offering or describing something as if it can be bought and used now when it cannot is misleading (s29, s33 to s34 for services).
- **Component pricing (s48)**: when a price is published, the single total price including GST must be shown at least as prominently as any part price. This matters once prices are switched on.

## What was found and changed

| # | Issue | Change made |
|---|---|---|
| 1 | Headline "Do you want to save A$250,000 a year? Here are your options." implies the options will produce that saving (future matter, no reasonable grounds yet). | Now "Want to save A$250,000 a year? See what it would take." with a qualifier directly under it: every figure is yours or an example, none is a measured result. |
| 2 | Goal headings "Save A$250,000 / A$500,000 / A$1 million a year" read as promises. | Now "Reaching A$250,000 a year" and so on; each option is written as a condition ("If Finance took on half the work of a finance team of ten") and introduced "For example, a business with ...". Totals say "Example total". |
| 3 | "A finance team of ten becomes five" asserts the product replaces five people. | Reworded as a condition; the page says the share is the visitor's estimate and has not yet been measured at customer sites, and that measured results will replace the examples. |
| 4 | Calculator result "Estimated yearly saving" and "the work of about N people, handed to Teracom AI" read as an outcome. | Now "Your estimate: the yearly cost of the work handed over", "on your figures ... if the Departments take on the share you entered", and that its worth depends on what the business does with the time. |
| 5 | Payback "they pay for themselves in about N months" (only when prices are on) is a future claim. | Now "on your figures the cost equals about N months of the estimate". |
| 6 | Departments are in early access (production readiness not finished), but the pages read as if they can be bought now. | An early-access line with Register interest under each page's headline; store pages say "Early access · pricing coming soon". |
| 7 | Finance page "The work it does each week" / "What it takes off your team" states present performance. | Now "What it is designed to take on" / "What its digital workers do", and "how much of your team's work it takes on depends on your business". |
| 8 | "No setup fee and no platform fee" stated while prices are provisional. | Shown only once prices are published, next to the price. |
| 9 | Prices ex GST only (when switched on). | Price shown including GST first, ex GST in brackets, on the Finance page and in the calculator. |
| 10 | The disclaimer "Estimates only. Your results depend on your business." | Kept under every calculator and goal block, and backed by the prominent qualifier at the top (it no longer has to do the work alone). |

Unchanged and acceptable: every default is labelled illustrative and editable; the arithmetic is shown in full; there are no statistics, testimonials, case studies or guarantees; the human-control wording comes from Global's catalogue.

## For the solicitor to confirm before go-live

1. The headline and qualifiers above, read together, do not convey that a saving will happen (s4, s18).
2. Using A$100,000 a person and 30% as starting figures, labelled illustrative and editable, is acceptable without published evidence for the 30% (Robert approved both as defaults on 3 November 2026).
3. Whether describing what the Department's digital workers are "designed to do" is accurate enough while Department delivery is being completed, or whether those sections should wait for production readiness.
4. Once prices are published: GST-inclusive display, bundle discount wording, and annual billing terms.
5. Whether any of this also needs the proof-of-concept terms linked from the pages.

## Going live

The pages stay hidden until `SAVINGS_PAGES_LIVE` in `lib/savings.js` is switched on, and prices stay hidden until `PRICES_PUBLISHED` is switched on. Both need Robert's approval; this review recommends the solicitor's sign-off on the points above first.
