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
    home: "Misty is a collaborative workspace for people and their agents. Pick any agent and work on your own, or invite others into a space you all share.",
    pricing:
      "Misty is free with every feature when you run the server yourself. Pro is a configured server for $10 a month, and AI is never charged for.",
    docs:
      "How Misty works, how to run your own Misty server, how to connect the app, and which models you can use.",
    download:
      "Download Misty for macOS and Windows. Both beta downloads are under 100 MB.",
    blog: "Notes on building Misty: what I’m making, what changed my mind, and what’s next.",
    changelog:
      "Every Misty release and the changes that shipped with it, newest first.",
    roadmap:
      "What’s available in the Misty beta today, what’s in pilot, and what’s still planned.",
  },
};
