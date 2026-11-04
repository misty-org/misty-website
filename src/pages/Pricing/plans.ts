/**
 * Misty Pro's plan, in one place. These are the numbers the Cloud server's
 * account limits use; change both together.
 */
export const cloudPlan = {
  price: 10,
  storageGb: 50,
  devices: 5,
  appActionsPerMonth: 1000,
} as const;

const count = (value: number) => value.toLocaleString("en-US");

export const freeIncludes: string[] = [
  "Every feature",
  "AI on your own models",
  "A server you set up and run, on a VPS or other computer that's always on",
  "A domain you own on Cloudflare, since Misty only connects to https domains",
  "Your own Cloudflare, Composio and Google accounts",
  "Works as a browser without a server",
];

export const cloudIncludes: string[] = [
  "Every feature",
  "AI on your own models",
  "A server that's already set up",
  `${cloudPlan.storageGb} GB of storage`,
  `Up to ${cloudPlan.devices} devices`,
  `${count(cloudPlan.appActionsPerMonth)} app actions a month`,
];

/** The two plans side by side: what it is, then Free, then Misty Pro. */
export const compareRows: [string, string, string][] = [
  ["Features", "All of them", "All of them"],
  ["Server", "You set it up and run it", "Already set up for you"],
  ["Hosting", "Your own VPS or always-on computer", "Included"],
  ["Domain", "Your own, on Cloudflare, over https", "Included"],
  ["AI", "Your own models", "Your own models"],
  ["Web search", "Your own search key", "Your own search key"],
  ["Storage", "Your own Cloudflare account", `${cloudPlan.storageGb} GB`],
  ["Devices", "No limit", `${cloudPlan.devices}`],
  [
    "App actions",
    "Your own Composio account",
    `${count(cloudPlan.appActionsPerMonth)} a month`,
  ],
];

/** Billing is the page's own last question, since its answer has links. */
export const pricingQuestions: { question: string; answer: string }[] = [
  {
    question: "What do I need for Free?",
    answer:
      "A VPS or other always-on computer to run the server, a domain you own on Cloudflare, and Cloudflare, Composio and Google accounts. Misty only connects to https domains, so plain http, IP addresses and localhost won't work. The domain and any hosting are yours to pay for.",
  },
  {
    question: "Do you charge for AI?",
    answer:
      "No. AI always runs on your own models, so Misty never charges for it, on Free or on Misty Pro.",
  },
  {
    question: "What counts toward storage?",
    answer:
      "Library files, notes, drawings and your encrypted sync data all count.",
  },
  {
    question: "What counts as a device?",
    answer: "Each computer signed in to your account is one device.",
  },
  {
    question: "What are app actions?",
    answer:
      "Things agents do in your connected apps, such as sending a Slack message or adding a calendar event. Web search runs on your computer with your own search key, so it isn't counted.",
  },
  {
    question: "What happens at the app action limit?",
    answer:
      "Agents stop acting in apps until the count resets each month on the day you subscribed, your billing date. Everything else keeps working.",
  },
  {
    question: "How do I get my account?",
    answer:
      "Misty Pro goes on your Misty account, so you sign in or make one before paying.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "Cancelling takes effect at the end of the month you've paid for. After that your account is read-only for 30 days so you can export your data from the Misty app, and then it's deleted.",
  },
];
