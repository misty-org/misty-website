/**
 * Misty Pro's plan, in one place. The storage is the number the Cloud server's
 * account limits use; change both together.
 */
export const cloudPlan = {
  price: 10,
  storageGb: 50,
} as const;

export const freeIncludes: string[] = [
  "Every feature",
  "AI on your own models",
  "A server you set up and run, on a VPS or other computer that's always on",
  "A domain you own on Cloudflare, since Misty only connects to https domains",
  "Your own Cloudflare and Google accounts",
  "Works on one computer without a server",
];

export const cloudIncludes: string[] = [
  "Every feature",
  "AI on your own models",
  "A server that's already set up",
  `${cloudPlan.storageGb} GB of storage`,
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
  [
    "Connected apps",
    "Your own Composio key or the app's own sign-in",
    "Your own Composio key or the app's own sign-in",
  ],
];

/** Billing is the page's own last question, since its answer has links. */
export const pricingQuestions: { question: string; answer: string }[] = [
  {
    question: "What do I need for Free?",
    answer:
      "A VPS or other always-on computer to run the server, a domain you own on Cloudflare, and Cloudflare and Google accounts. Misty only connects to https domains, so plain http, IP addresses and localhost won't work. The domain and any hosting are yours to pay for.",
  },
  {
    question: "Do you charge for AI?",
    answer:
      "No. AI always runs on your own models, so Misty never charges for it, on Free or on Misty Pro.",
  },
  {
    question: "What counts toward storage?",
    answer:
      "Files you add to Spaces and the Library, docs, drawings and the messages you send all count.",
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
