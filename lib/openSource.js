// What the website, console and backend are built with (Robert, 2026-11-06: list every third-party
// library and open-source program, the way Teracom AI and the Global Platform do). Shown on the
// console's About page. Versions and licences were read from the installed packages on VM 101 on
// 6 November 2026; update this list when a dependency is added, removed or changes licence
// (package.json, the backend's requirements.txt, the server).

export const OPEN_SOURCE_CHECKED = '2026-11-06';

export const OPEN_SOURCE = [
  {
    key: 'website',
    title: 'Website, store and console (runs in the browser and on Vercel)',
    items: [
      ['Next.js', '16.4.3', 'MIT', 'https://nextjs.org', 'The web framework for every page'],
      ['React and React DOM', '19.3.1', 'MIT', 'https://react.dev', 'The page components'],
      ['Lucide React', '1.66.0', 'ISC', 'https://lucide.dev', 'The icons'],
      ['Zod', '4.6.7', 'MIT', 'https://zod.dev', 'Checks what forms and requests send'],
      ['pdf-lib', '1.17.1', 'MIT', 'https://pdf-lib.js.org', 'Save as PDF on the calculators and tools'],
      ['sharp', '0.35.5', 'Apache-2.0', 'https://sharp.pixelplumbing.com', 'Resizes images'],
      ['Stripe (stripe, Stripe.js, React Stripe.js)', '23.1.0 / 10.2.0 / 7.0.1', 'MIT', 'https://github.com/stripe', 'Card payments at checkout'],
      ['Inter typeface', '4', 'SIL Open Font License 1.1', 'https://rsms.me/inter', 'The font'],
    ],
  },
  {
    key: 'website-dev',
    title: 'Used to build and test the website (not shipped to visitors)',
    items: [
      ['TypeScript and the Node type definitions', '6.0.3', 'Apache-2.0 / MIT', 'https://www.typescriptlang.org', 'Type checking'],
      ['ESLint and eslint-config-next', '9.39.5 / 16.4.3', 'MIT', 'https://eslint.org', 'Code checks'],
      ['Playwright', '1.64.1', 'Apache-2.0', 'https://playwright.dev', 'Browser tests'],
    ],
  },
  {
    key: 'backend',
    title: 'Backend (the API on VM 101)',
    items: [
      ['FastAPI, Starlette and Uvicorn', '0.162.0 / 1.10.0 / 0.54.0', 'MIT / BSD-3-Clause', 'https://fastapi.tiangolo.com', 'The API server'],
      ['Pydantic and pydantic-settings', '2.14.2 / 2.16.2', 'MIT', 'https://docs.pydantic.dev', 'Checks every request'],
      ['SQLAlchemy', '2.1.6', 'MIT', 'https://www.sqlalchemy.org', 'Talks to the database'],
      ['psycopg2', '2.9.13', 'LGPL-3.0 with exceptions', 'https://www.psycopg.org', 'The PostgreSQL driver'],
      ['PyJWT, bcrypt, cryptography, PyOTP and qrcode', '2.15.1 / 5.0.0 / 50.0.2 / 2.10.0 / 8.2', 'MIT / Apache-2.0 / Apache-2.0 or BSD / MIT / BSD', 'https://cryptography.io', 'Sign-in, passwords, encrypted keys and two-step codes'],
      ['Requests, urllib3, certifi, aiohttp and requests-oauthlib', '2.34.2 / 2.8.0 / 2026.10.23 / 3.14.5 / 2.0.0', 'Apache-2.0 / MIT / MPL-2.0 / Apache-2.0 and MIT / ISC', 'https://requests.readthedocs.io', 'Calls to outside services'],
      ['LangChain (core, community, OpenAI, Anthropic, Groq, Ollama)', '1.4.7', 'MIT', 'https://docs.langchain.com', 'Scout research and the AI connections'],
      ['ddgs and duckduckgo_search', '9.16.1 / 8.1.1', 'MIT', 'https://github.com/deedy5/ddgs', 'Web search for Scout, Tera and the photo finder'],
      ['Beautiful Soup', '4.15.0', 'MIT', 'https://www.crummy.com/software/BeautifulSoup', 'Reads web pages'],
      ['pypdf', '6.21.4', 'BSD-3-Clause', 'https://pypdf.readthedocs.io', 'Reads PDFs'],
      ['PyMuPDF', '2.0', 'AGPL-3.0 (or a paid Artifex licence)', 'https://pymupdf.readthedocs.io', 'Makes the signed form PDFs and reads manuals for Tera'],
      ['Pillow', '13.0.0', 'MIT-CMU', 'https://python-pillow.org', 'Product and project photos'],
      ['openpyxl and xlrd', '3.1.5 / 2.0.2', 'MIT / BSD', 'https://openpyxl.readthedocs.io', 'Supplier price lists'],
      ['smbprotocol and pyspnego', '1.17.0 / 0.12.4', 'MIT', 'https://github.com/jborean93/smbprotocol', 'Saves forms to the network folder'],
      ['packaging, filelock, python-dotenv, python-multipart, OpenTelemetry API and the rest of the Python standard set', 'see Connections, Software', 'Apache-2.0 / BSD / MIT', 'https://pypi.org', 'Supporting packages; every installed package and its version is on Connections, Software'],
      ['pytest', '9.1.1', 'MIT', 'https://pytest.org', 'Backend tests (not part of the running service)'],
    ],
  },
  {
    key: 'server',
    title: 'Server and services (VM 101)',
    items: [
      ['Ubuntu', '24.04.5 LTS', 'GPL and others (Ubuntu licence policy)', 'https://ubuntu.com', 'The operating system'],
      ['Python', '3.12.3', 'PSF License', 'https://www.python.org', 'Runs the backend'],
      ['PostgreSQL', '16.15', 'PostgreSQL License', 'https://www.postgresql.org', 'The database'],
      ['Node.js', '22.23.4', 'MIT', 'https://nodejs.org', 'Builds and checks the website'],
      ['cloudflared', '2026.9.1', 'Apache-2.0', 'https://github.com/cloudflare/cloudflared', 'The tunnel to api.teracomsolutions.com.au'],
      ['Ollama', '0.35.1', 'MIT', 'https://ollama.com', 'Runs Tera\'s own language model on the server'],
      ['Qwen2.5 3B (Tera\'s model)', 'qwen2.5:3b', "Qwen Research Licence: non-commercial only (kept by Robert's decision)", 'https://huggingface.co/Qwen/Qwen2.5-3B-Instruct', 'Tera\'s answers when its own model is used'],
      ['Qwen2.5 1.5B and Llama 3.2 3B (installed, not in use)', 'qwen2.5:1.5b / llama3.2:3b', 'Apache-2.0 / Llama 3.2 Community Licence', 'https://ollama.com/library', 'Alternatives for Tera'],
    ],
  },
  {
    key: 'services',
    title: 'Outside services the website uses (accounts, not software we run)',
    items: [
      ['Vercel', '', 'Service terms', 'https://vercel.com', 'Hosts the website'],
      ['Cloudflare (DNS, tunnel, Turnstile)', '', 'Service terms', 'https://www.cloudflare.com', 'Address, tunnel and spam checks on forms'],
      ['Stripe', '', 'Service terms', 'https://stripe.com', 'Payments'],
      ['Google (Search Console, Analytics, Merchant Center, PageSpeed, Business Profile)', '', 'Service terms', 'https://developers.google.com', 'Search figures, Shopping and the growth tools'],
      ['Meta (Pixel, Conversions API, catalogue)', '', 'Service terms', 'https://developers.facebook.com', 'Facebook and Instagram'],
      ['Zoho Books', '', 'Service terms', 'https://www.zoho.com/books', 'Orders and invoices (when connected)'],
      ['Microsoft Azure Speech', '', 'Service terms', 'https://azure.microsoft.com/products/ai-services/text-to-speech', 'Tera\'s Australian voice (when chosen)'],
      ['AI providers (Anthropic, OpenAI, Groq)', '', 'Service terms', 'https://www.anthropic.com', 'The AI Connections the Assistant, Scout and Tera use'],
      ['Australia Post and StarTrack', '', 'Service terms', 'https://developers.auspost.com.au', 'Freight prices'],
      ['IndexNow', '', 'Open protocol', 'https://www.indexnow.org', 'Tells Bing and others about changed pages'],
    ],
  },
];

// Licences that need a decision, shown at the top of the list.
export const LICENCE_NOTES = [
  "Qwen2.5 3B, Tera's model, is licensed for non-commercial use only. Kept for research and customer questions by Robert's decision (6 November 2026), who accepts the risk. If it is ever changed, Llama 3.2 3B (commercial use allowed, with a 'Built with Llama' notice) is already on the server.",
  'PyMuPDF is AGPL-3.0: using it in the backend could oblige us to publish the backend\'s source code, unless we buy Artifex\'s commercial licence. Replacing it with pypdf (already used) and a permissive PDF writer removes the question.',
];
