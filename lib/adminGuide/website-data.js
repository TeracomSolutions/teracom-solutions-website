export default `## Website Data

This part of the admin console shows how many people visit the website and where they come from. Staff use it to understand which pages are popular, what devices visitors use, and where they come from geographically. It helps in making decisions about content and marketing.

### How to get there

Click **Website Data** in the main admin menu.

### What you see

The page shows a summary of website visitor data for the selected period. There are tabs at the top to change the time range.

**Tabs**

- 7 days
- 30 days (default)
- 90 days

These tabs let you switch between different periods of data. Clicking one updates the page with that time range.

**Stats Summary**

Below the tabs are three summary cards showing:

1. **Page views** - how many times people loaded web pages
2. **Visitors** - how many distinct people visited in that period (added up over the period)
3. **Views per visitor** - average number of page views per visitor

Each card shows a change compared to the previous period, like for example +15% vs previous 450.

**Charts**

Below the summary stats are two charts showing daily trends:

- Page views chart
- Visitors chart

Each chart has these features:

- Thin rounded bars for each day
- Hover tooltips showing exact numbers
- Toggle between chart and table view using "Show chart" or "Show table" button
- Grid lines and labels for easy reading

**Top Pages Table**

This shows the most-read pages in your selected period.

Columns:
- Page - URL path of the page
- Views - how many times people viewed it
- Visitors - unique visitors to that page
- Share - percentage of total views this page got, shown as a bar

**Where visitors came from Table**

Shows which websites linked to yours.

Columns:
- Site - source website or direct (for people who typed the address)
- Views - how many times people came from that site
- Visitors - unique visitors from that site
- Share - percentage of total views from that site, shown as a bar

**Countries Table**

Shows where visitors are from.

Columns:
- Country - country name
- Views - how many times people viewed pages from that country
- Visitors - unique visitors from that country
- Share - percentage of total views from that country, shown as a bar

**Devices Table**

Shows what devices visitors used.

Columns:
- Device - type of device (mobile, tablet, desktop)
- Views - how many times people viewed pages on that device
- Visitors - unique visitors using that device
- Share - percentage of total views from that device, shown as a bar

**States and regions Table**

Shows which states or regions visitors are from.

Columns:
- Region - state or region name
- Views - how many times people viewed pages from that region
- Visitors - unique visitors from that region
- Share - percentage of total views from that region, shown as a bar

**Tracking Since Information**

Below the tabs there is information showing when tracking started:

"Recording since <DATE>. Compared with the 30 days before."

This shows the date when data collection began and which period it compares to.

### Step by step

**To view website data for a specific time period**

1. Click one of the tabs at the top: 7 days, 30 days (default), or 90 days. The page will update with data for that period.

**To see daily trends in more detail**

1. Hover over any bar in the charts to see the exact numbers for that day.
2. You can also click "Show table" to view the chart data as a table instead of a chart.

**To find out which pages are most popular**

1. Look at the "Top pages" table.
2. The share column shows how much each page contributed to total views, with the bar showing the percentage and the number beside it showing the percentage value.

### Good to know

- Data is recorded as each public page view happens by the website's own tracking system on our own server
- A visitor is counted once per day by an anonymous code made from their address and browser with a daily salt
- No personal information or addresses are stored
- Known bots and crawlers are ignored, as are admin pages
- Google Analytics continues to run alongside this data
- The page shows data in Sydney time (UTC+10/11)
- Days run midnight to midnight, Sydney time
- Recording started the day this page went live, so the first comparison period will be short

### If something goes wrong

- "Unable to load visitor data from the backend." - This means there was a problem getting data from the website's backend system. Try refreshing the page. If the error persists, contact IT support.
`;