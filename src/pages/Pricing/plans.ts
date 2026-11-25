export type PlanId = "free" | "pro" | "max";
export type PaidPlanId = Exclude<PlanId, "free">;
export type CheckoutPlan = "pro" | "pro_yearly" | "max" | "max_yearly";

export const plans = {
  free: { name: "Free", storage: "5 GB" },
  pro: { name: "Pro", monthly: 10, yearly: 100, storage: "250 GB" },
  max: { name: "Max", monthly: 20, yearly: 200, storage: "1 TB" },
} as const;

export const checkoutPlans: readonly CheckoutPlan[] = ["pro", "pro_yearly", "max", "max_yearly"];

export function isCheckoutPlan(value: string | null): value is CheckoutPlan {
  return checkoutPlans.includes(value as CheckoutPlan);
}

export function checkoutPlan(plan: PaidPlanId, yearly: boolean): CheckoutPlan {
  return yearly ? `${plan}_yearly` : plan;
}

export function yearlySaving(monthly: number, yearly: number): number {
  return Math.round((1 - yearly / (monthly * 12)) * 100);
}

export function planName(plan: string | undefined): string {
  return plan === "pro" || plan === "max" ? plans[plan].name : plans.free.name;
}

export const taglines = {
  free: "Misty Cloud or your own server.",
  pro: "More storage for your files.",
  max: "The most storage.",
} as const;

export const includes = {
  free: [
    "Every feature",
    "Works with Claude Code, Codex, Antigravity and more",
    `${plans.free.storage} on Misty Cloud`,
    "Unlimited spaces",
  ],
  pro: ["Everything in Free", `${plans.pro.storage} of storage`],
  max: ["Everything in Free", `${plans.max.storage} of storage`],
} as const;

export const pricingQuestions: { question: string; answer: string }[] = [
  {
    question: "How do the plans differ?",
    answer: `Only in storage: ${plans.free.storage} on Free, ${plans.pro.storage} on Pro and ${plans.max.storage} on Max. No plan limits how many people or agents a space holds, how many spaces you have, your devices or the size of a file.`,
  },
  {
    question: "Can I change plans?",
    answer:
      "Yes. Move between Pro and Max, or between monthly and yearly, in your account settings. The change happens right away, and what's left of the period you paid for counts toward it.",
  },
  {
    question: "What happens if my plan ends?",
    answer:
      "Nothing is deleted. Your account goes back to Free and keeps everything. Anything over Free's storage stays where it is and opens as before; you just can't add more until it's under again.",
  },
  {
    question: "Do you charge for AI?",
    answer:
      "No. AI always runs on your own models, so Misty never charges for it, on any plan.",
  },
  {
    question: "Is self-hosted Misty limited?",
    answer:
      "No. Misty is free and open source, and a server you run has every feature with no plan limits.",
  },
  {
    question: "What do I need to host my own server?",
    answer:
      "A VPS or other always-on computer to run the server, a domain you own on Cloudflare, and Cloudflare and Google accounts. Misty only connects to https domains, so plain http, IP addresses and localhost won't work. The domain and any hosting are yours to pay for.",
  },
];
