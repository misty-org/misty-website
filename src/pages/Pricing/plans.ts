export type PlanId = "free" | "plus";
export type CheckoutPlan = "plus" | "plus_yearly" | "boost" | "boost_yearly";

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

export const boost = { name: "Boosts", price: 2, yearly: 18 } as const;

export function yearlySaving(monthly: number, yearly: number): number {
  return Math.round((1 - yearly / (monthly * 12)) * 100);
}

export function planName(plan: string | undefined): string {
  return plan === "plus" ? plans.plus.name : plans.free.name;
}

export const taglines = {
  free: "Misty Cloud or your own server.",
  plus: "More storage, and Boosts to give.",
  boost: "Level up a space for everyone.",
} as const;

export const includes = {
  free: [
    "Every feature",
    "Works with Claude Code, Codex and Antigravity",
    `${plans.free.storage} on Misty Cloud`,
    "Unlimited spaces",
  ],
  plus: [
    "Everything in Free",
    `${plans.plus.storage} of storage`,
    `Files up to ${plans.plus.upload}`,
    `${plans.plus.boosts} Boosts, movable weekly`,
  ],
  boost: [
    "Anyone in a space can boost it",
    "Boosts add up to a level",
    "More members, storage and agents",
  ],
} as const;

export const storagePerBoost = "5 GB";

export const spaceLevels = [
  { name: "Base", boosts: 0, members: "10", storage: "Members' own", upload: "25 MB", agents: "3" },
  { name: "Level 1", boosts: 2, members: "25", storage: "25 GB", upload: "100 MB", agents: "10" },
  { name: "Level 2", boosts: 7, members: "100", storage: "100 GB", upload: "100 MB", agents: "25" },
  { name: "Level 3", boosts: 14, members: "500", storage: "500 GB", upload: "100 MB", agents: "Unlimited" },
] as const;

export const levelRows: { label: string; key: "members" | "storage" | "upload" | "agents" }[] = [
  { label: "People", key: "members" },
  { label: "Shared storage", key: "storage" },
  { label: "Largest file", key: "upload" },
  { label: "Agents", key: "agents" },
];

export const pricingQuestions: { question: string; answer: string }[] = [
  {
    question: "What does a Boost do?",
    answer: `A Boost is $${boost.price} a month or $${boost.yearly} a year for one space. Boosts from everyone in a space add up, and at 2, 7 and 14 the space reaches the next level, which raises how many people and agents it holds and gives it its own storage. Each Boost past a level adds ${storagePerBoost} more.`,
  },
  {
    question: "Whose storage does a space use?",
    answer:
      "A Space below Level 1 stores files in the storage of whoever added them. From Level 1 a space has its own storage, so its files no longer count against anyone's.",
  },
  {
    question: "What happens if Boosts or Misty+ end?",
    answer:
      "Nothing is deleted. A Space drops to the level its remaining Boosts reach, and your account goes back to Free. Anything over a limit stays where it is and opens as before; you just can't add more until it's under again.",
  },
  {
    question: "How do Misty+ Boosts work?",
    answer:
      "Misty+ comes with 3 Boosts. Give them to any spaces you're in from your account settings. You can move them to a different space once a week.",
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
