import type { IntegrationDoc } from "./types";

export const searchEnv: IntegrationDoc = {
  slug: "search",
  file: "search.env",
  service: "Web search",
  summary: "Gives agents web search, through Decodo or Serper.",
  purpose: [
    "When an agent searches the web, the server asks your search provider for Google results and passes them back. No model is involved. The server keeps each result for six hours, so asking the same thing again costs nothing.",
    "Pick either provider. Serper offers every Google tab: web, news, videos, images, places, shopping, scholar, patents, maps and autocomplete. Decodo offers web, news, videos and images. Agents only see the kinds your provider offers.",
  ],
  account: [
    "A [Decodo](https://decodo.com) account with the Web Scraping API, or a [Serper](https://serper.dev) account. Both charge per search; Serper sells prepaid credits, and new accounts get free searches to start.",
  ],
  youSet: [
    {
      name: "MISTY_SEARCH_PROVIDER",
      about: "Which provider runs web search.",
      howTo: "`decodo` or `serper`.",
    },
    {
      name: "MISTY_SEARCH_API_KEY",
      about: "That provider's API key.",
      howTo:
        "For Decodo, the Web Scraping API key in the Decodo dashboard. For Serper, the API Key page in the Serper dashboard.",
    },
  ],
  steps: [
    "Sign up with Decodo or Serper and copy your API key.",
    "Write the provider's name and the key into `server/.env/search.env`.",
  ],
  example: `MISTY_SEARCH_PROVIDER=decodo
MISTY_SEARCH_API_KEY=<your API key>`,
};
