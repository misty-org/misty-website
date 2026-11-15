/**
 * Misty Cloud's plans and Space levels, in one place. The numbers match what the Cloud server
 * and billing enforce (misty-cloud's plan.go, and the server's MISTY_SIGNUP_LIMITS and
 * MISTY_SPACE_LEVELS); change them together. Self-hosted Misty has none of this: every Space
 * there is unlimited.
 */
export type PlanId = "free" | "plus";
/** What checkout sells: Misty+ monthly or yearly, or Boosts for a Space. */
export type CheckoutPlan = "plus" | "plus_yearly" | "boost";

export const plans = {
  free: { name: "Free", storage: "5 GB" },
  plus: {
    name: "Misty+",
    monthly: 8,
    yearly: 72,
    storage: "100 GB",
    upload: "100 MB",
    boosts: 3,
  },
} as const;

export const boost = { name: "Boosts", price: 2 } as const;

export function planName(plan: string | undefined): string {
  return plan === "plus" ? plans.plus.name : plans.free.name;
}

/** One line under each card's name, saying who it's for. */
export const taglines = {
  free: "Misty Cloud, or your own server.",
  plus: "More room, and Boosts to give.",
  boost: "Raise a Space's level for everyone in it.",
} as const;

/**
 * What each card includes, in plain words. Setup details (a VPS, a domain on Cloudflare, https)
 * stay in the "What do I need to host my own server?" question; Free's last line, which links
 * to the self-hosting guide, is in index.tsx.
 */
export const includes = {
  free: [
    "Every feature",
    "Works with the AI you already use, like Claude Code, Codex and Antigravity",
    `${plans.free.storage} of storage on Misty Cloud`,
    "Make and join as many Spaces as you like",
  ],
  plus: [
    "Everything in Free",
    `${plans.plus.storage} of storage`,
    `Files up to ${plans.plus.upload} in any Space`,
    `${plans.plus.boosts} Boosts to give your Spaces, moved once a week`,
  ],
  boost: [
    "Anyone in a Space can boost it",
    "Boosts from everyone add up to the Space's level",
    "Each level raises members, shared storage and agents",
  ],
} as const;

/**
 * A Space's levels: the Boosts each needs, and what it allows. Each Boost past a level's
 * threshold adds `storagePerBoost` of shared storage.
 */
export const storagePerBoost = "5 GB";

export const spaceLevels = [
  { name: "Base", boosts: 0, members: "10", storage: "Members' own", upload: "25 MB", agents: "3" },
  { name: "Level 1", boosts: 2, members: "25", storage: "25 GB", upload: "100 MB", agents: "10" },
  { name: "Level 2", boosts: 7, members: "100", storage: "100 GB", upload: "100 MB", agents: "25" },
  { name: "Level 3", boosts: 14, members: "500", storage: "500 GB", upload: "100 MB", agents: "Unlimited" },
] as const;

/** The rows of the levels table, in order. */
export const levelRows: { label: string; key: "members" | "storage" | "upload" | "agents" }[] = [
  { label: "People", key: "members" },
  { label: "Shared storage", key: "storage" },
  { label: "Largest file", key: "upload" },
  { label: "Agents", key: "agents" },
];

/** Billing is the page's own last question, since its answer has links. */
export const pricingQuestions: { question: string; answer: string }[] = [
  {
    question: "What does a Boost do?",
    answer: `A Boost is $${boost.price} a month for one Space. Boosts from everyone in a Space add up, and at 2, 7 and 14 the Space reaches the next level, which raises how many people and agents it holds and gives it its own storage. Each Boost past a level adds ${storagePerBoost} more.`,
  },
  {
    question: "Whose storage does a Space use?",
    answer:
      "A Space below Level 1 stores files in the storage of whoever added them. From Level 1 a Space has its own storage, so its files no longer count against anyone's.",
  },
  {
    question: "What happens if Boosts or Misty+ end?",
    answer:
      "Nothing is deleted. A Space drops to the level its remaining Boosts reach, and your account goes back to Free. Anything over a limit stays where it is and opens as before; you just can't add more until it's under again.",
  },
  {
    question: "How do Misty+ Boosts work?",
    answer:
      "Misty+ comes with 3 Boosts. Give them to any Spaces you're in from your account settings. You can move them to a different Space once a week.",
  },
  {
    question: "Do you charge for AI?",
    answer:
      "No. AI always runs on your own models, so Misty never charges for it, on any plan.",
  },
  {
    question: "Is self-hosted Misty limited?",
    answer:
      "No. Misty is free and open source, and a server you run has every feature with no levels or Boosts.",
  },
  {
    question: "What do I need to host my own server?",
    answer:
      "A VPS or other always-on computer to run the server, a domain you own on Cloudflare, and Cloudflare and Google accounts. Misty only connects to https domains, so plain http, IP addresses and localhost won't work. The domain and any hosting are yours to pay for.",
  },
];
