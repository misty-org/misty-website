export type CustomerPlanId = keyof typeof PRICING_MODEL;
export type PaidTier = "pro" | "max" | "ultra" | "ultra_plus";
export type BillingInterval = "month" | "year";
export type PricingInterval = BillingInterval;

/**
 * Single source of truth for plan limits and the phrasing used to describe
 * them. Everything below — the cards, the comparison table, the FAQ, and the
 * account settings upgrade prompt — reads from here so the numbers and wording
 * can never drift apart. The numbers match the billing service's account-v2
 * policy: every plan has every feature and unlimited sync, and plans differ
 * only in AI, models and storage.
 */
export const PRICING_MODEL = {
  free: {
    id: "free",
    name: "Basic",
    monthlyPrice: "Free",
    yearlyPrice: "Free",
    storage: "5 GB",
    agentUsage: "AI on Misty’s fast model, refilling every 5 hours and every week",
    models: "Fast model",
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthlyPrice: "$12",
    yearlyPrice: "$120",
    yearlySavings: "$24",
    storage: "50 GB",
    agentUsage: "About 3½× Basic’s AI, on smarter models",
    models: "Every model, flagship included",
  },
  max: {
    id: "max",
    name: "Max",
    monthlyPrice: "$20",
    yearlyPrice: "$200",
    yearlySavings: "$40",
    storage: "200 GB",
    agentUsage: "About 6× Basic’s AI",
    models: "Every model, flagship included",
  },
  ultra: {
    id: "ultra",
    name: "Ultra",
    monthlyPrice: "$100",
    yearlyPrice: "$1,000",
    yearlySavings: "$200",
    storage: "1 TB",
    agentUsage: "More AI than five Max plans, sized for frontier models",
    models: "Every model, flagship included",
  },
  ultra_plus: {
    id: "ultra_plus",
    name: "Ultra+",
    monthlyPrice: "$200",
    yearlyPrice: "$2,000",
    yearlySavings: "$400",
    storage: "2 TB",
    agentUsage: "More AI than two Ultra plans, for the longest tasks",
    models: "Every model, flagship included",
  },
} as const;

const paidPrices = (tier: PaidTier) => ({
  month: {
    price: PRICING_MODEL[tier].monthlyPrice,
    period: "/ month",
    billingNote: "Billed monthly",
  },
  year: {
    price: PRICING_MODEL[tier].yearlyPrice,
    period: "/ year",
    billingNote: `Two months free: save ${PRICING_MODEL[tier].yearlySavings} a year`,
  },
});

const paidFeatures = (tier: PaidTier) => [
  PRICING_MODEL[tier].agentUsage,
  PRICING_MODEL[tier].models,
  `${PRICING_MODEL[tier].storage} storage`,
  "Unlimited sync",
  "Every Misty feature",
];

export const plans = [
  {
    id: "free",
    name: PRICING_MODEL.free.name,
    prices: {
      month: { price: PRICING_MODEL.free.monthlyPrice, period: "", billingNote: "Free forever" },
      year: { price: PRICING_MODEL.free.yearlyPrice, period: "", billingNote: "Free forever" },
    },
    features: [
      PRICING_MODEL.free.agentUsage,
      `${PRICING_MODEL.free.storage} storage`,
      "Unlimited sync",
      "Every Misty feature",
    ],
  },
  { id: "pro", name: PRICING_MODEL.pro.name, prices: paidPrices("pro"), features: paidFeatures("pro") },
  { id: "max", name: PRICING_MODEL.max.name, prices: paidPrices("max"), features: paidFeatures("max") },
  { id: "ultra", name: PRICING_MODEL.ultra.name, prices: paidPrices("ultra"), features: paidFeatures("ultra") },
  {
    id: "ultra_plus",
    name: PRICING_MODEL.ultra_plus.name,
    prices: paidPrices("ultra_plus"),
    features: paidFeatures("ultra_plus"),
  },
] as const;

export const planLimitRows = [
  {
    label: "Price",
    basic: PRICING_MODEL.free.monthlyPrice,
    pro: `${PRICING_MODEL.pro.monthlyPrice} monthly / ${PRICING_MODEL.pro.yearlyPrice} yearly`,
    max: `${PRICING_MODEL.max.monthlyPrice} monthly / ${PRICING_MODEL.max.yearlyPrice} yearly`,
    ultra: `${PRICING_MODEL.ultra.monthlyPrice} monthly / ${PRICING_MODEL.ultra.yearlyPrice} yearly`,
    ultra_plus: `${PRICING_MODEL.ultra_plus.monthlyPrice} monthly / ${PRICING_MODEL.ultra_plus.yearlyPrice} yearly`,
  },
  {
    label: "AI",
    basic: PRICING_MODEL.free.agentUsage,
    pro: PRICING_MODEL.pro.agentUsage,
    max: PRICING_MODEL.max.agentUsage,
    ultra: PRICING_MODEL.ultra.agentUsage,
    ultra_plus: PRICING_MODEL.ultra_plus.agentUsage,
  },
  {
    label: "Models",
    basic: PRICING_MODEL.free.models,
    pro: PRICING_MODEL.pro.models,
    max: PRICING_MODEL.max.models,
    ultra: PRICING_MODEL.ultra.models,
    ultra_plus: PRICING_MODEL.ultra_plus.models,
  },
  {
    label: "Storage",
    basic: PRICING_MODEL.free.storage,
    pro: PRICING_MODEL.pro.storage,
    max: PRICING_MODEL.max.storage,
    ultra: PRICING_MODEL.ultra.storage,
    ultra_plus: PRICING_MODEL.ultra_plus.storage,
  },
  {
    label: "Sync",
    basic: "Unlimited",
    pro: "Unlimited",
    max: "Unlimited",
    ultra: "Unlimited",
    ultra_plus: "Unlimited",
  },
] as const;

/** How usage works, in the order people ask about it. */
export const ownerRules = [
  {
    title: "Every plan has every feature",
    description:
      "Basic is free forever and nothing is held back. Paid plans add more AI, smarter models and more storage. Sync is unlimited on every plan.",
  },
  {
    title: "AI refills on its own",
    description:
      "Your AI refills five hours after a session starts and again every week. A task that is already running can finish a little past a limit.",
  },
  {
    title: "Your plan is yours",
    description:
      "AI and storage belong to your account. Joining someone’s Space never uses or changes your plan.",
  },
  {
    title: "Friends add more",
    description:
      "Each friend who subscribes through your invite link adds AI to your plan every month, for as long as they stay.",
  },
] as const;

export const pricingFaqs = [
  {
    q: "Is there a free trial?",
    a: "Basic is the trial, and it never ends. Every feature is included, and you can upgrade or cancel a paid plan at any time.",
  },
  {
    q: "How is AI usage measured?",
    a: "By what the work costs to run, so a quick question uses far less than a long agent task, and faster models stretch further than frontier ones. Usage refills five hours after a session starts and every week, with a monthly ceiling that steady weekly use never reaches.",
  },
  {
    q: "What happens when I reach a limit?",
    a: "Misty tells you when it refills. A task that is already running gets to finish, and a multi-step goal pauses and picks up again by itself once your AI refills.",
  },
  {
    q: "Does joining a paid member’s Space upgrade my plan?",
    a: "No. AI and storage come from your own plan, whichever Spaces you join.",
  },
] as const;
