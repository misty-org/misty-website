/**
 * Pro's plan, in one place. The storage is the number the Cloud server's
 * account limits use; change both together.
 */
export const cloudPlan = {
  price: 10,
  storageGb: 50,
} as const;

/** One line under each plan's name, saying who it's for. */
/** The plans differ only in who runs the server: Misty is collaborative on either. */
export const freeTagline = "You host the server.";
export const cloudTagline = "We host the server for you.";

/**
 * What each plan includes, in plain words. Setup details (a VPS, a domain on Cloudflare, https) stay in the
 * "What do I need for Free?" question; Free's last line, which links to the self-hosting guide, is in index.tsx.
 */
export const freeIncludes: string[] = [
  "Every feature",
  "Works with the AI you already use, like Claude Code, Codex and Antigravity",
  "Runs on your computer, with nothing to set up",
];

export const cloudIncludes: string[] = [
  "Everything in Free",
  "Spaces you can share right away",
  "Nothing to host, set up or maintain",
  `${cloudPlan.storageGb} GB for your Spaces' files, docs and chats`,
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
      "No. AI always runs on your own models, so Misty never charges for it, on Free or on Pro.",
  },
  {
    question: "What counts toward storage?",
    answer:
      "Files you add to Spaces and the Library, docs, drawings and the messages you send all count.",
  },
  {
    question: "How do I get my account?",
    answer:
      "Pro goes on your Misty account, so you sign in or make one before paying.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "Cancelling takes effect at the end of the month you've paid for. After that your account is read-only for 30 days so you can export your data from the Misty app, and then it's deleted.",
  },
];
