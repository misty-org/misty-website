export interface MarketingCopy {
  pricing: { title: string };
  auth: {
    registerTitle: string;
  };
  metadata: Record<string, string>;
}

export const marketingCopy: MarketingCopy = {
  pricing: {
    title: "Pricing",
  },
  auth: {
    registerTitle: "Create an account",
  },
  metadata: {
    home: "A collaborative environment where people and their agents learn, work and create together. Bring any engine, build in spaces you share, and explore what others have made.",
    pricing:
      "Misty is free with every feature, on Misty Cloud or a server you run yourself. Misty+ adds storage for $8 a month, Boosts raise a space's level for $2 each, and AI is never charged for.",
    docs:
      "How Misty works, how to run your own Misty server, how to connect the app, and which models you can use.",
    download:
      "Download the latest Misty release for macOS and Windows.",
    blog: "Notes on building Misty: what I’m making, what changed my mind, and what’s next.",
    changelog:
      "Every Misty release and the changes that shipped with it, newest first.",
    roadmap:
      "What’s available in the Misty beta today, what’s in pilot, and what’s still planned.",
  },
};
