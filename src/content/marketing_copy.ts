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
    home: "Chat, files and apps, all shared between you, your friends and your agents.",
    pricing:
      "Misty is free with every feature, on Misty Cloud or a server you run yourself. Pro adds storage for $10 a month and Max for $20, and AI is never charged for.",
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
