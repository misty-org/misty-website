export interface MarketingCopy {
  home: {
    /** The visible headline rotates through each word; the full title remains available to assistive technology. */
    heroTitle: string;
    heroTitleLead: string;
    heroDescription: string;
    heroTitleWords: readonly string[];
    ctaTitle: string;
  };
  download: { title: string; description: string };
  pricing: { title: string };
  blog: { title: string; description: string };
  changelog: { title: string; description: string };
  roadmap: { title: string; description: string };
  kiri: { title: string };
  waitlist: { title: string };
  auth: {
    registerTitle: string;
  };
  metadata: Record<string, string>;
}

export const marketingCopy: MarketingCopy = {
  home: {
    heroTitle: "A browser for your work.",
    heroTitleLead: "A browser for",
    heroDescription: "Misty puts websites, native tools, and agents in one workspace. It's free and open source, and it continues on another computer with encrypted sync for your tabs and website sign-ins.",
    heroTitleWords: [
      "your work.",
      "your tabs.",
      "your ideas.",
      "your focus.",
      "your plans.",
      "your tasks.",
      "your day.",
    ],
    ctaTitle: "Make Misty your browser workspace.",
  },
  download: {
    title: "Get Misty for your desktop.",
    description:
      "Misty is available for macOS and Windows. The current beta download is 44 MB on macOS and 70 MB on Windows.",
  },
  pricing: {
    title: "Pricing",
  },
  blog: {
    title: "Notes on building Misty.",
    description:
      "What we’re building, what changed our minds, and where the product is heading.",
  },
  changelog: {
    title: "What shipped, and when.",
    description: "Every release of Misty, with the changes that came with it.",
  },
  roadmap: {
    title: "What we’re building next.",
    description:
      "What’s available in beta today, what’s in pilot, and what’s still planned.",
  },
  kiri: {
    title: "Kiri runs Chrome and Firefox extensions in one browser.",
  },
  waitlist: {
    title: "Join Misty",
  },
  auth: {
    registerTitle: "Create an account",
  },
  metadata: {
    kiri: "How Misty runs extensions from both the Chrome Web Store and Firefox Add-ons on one engine, which APIs Kiri adds, and what keeps each extension within the access you approve.",
    home: "Misty is a free, open-source browser workspace with native tools, agents, and encrypted sync for your tabs and website sign-ins across computers.",
    pricing:
      "Misty is free with every feature when you run the server yourself. Misty Pro is a configured server for $10 a month, and AI is never charged for.",
    docs:
      "How Misty works, how to run your own Misty server, how to connect the app, and which models you can use.",
    download:
      "Download the Misty browser workspace for macOS and Windows. Both current beta downloads are under 100 MB.",
    blog: "Notes from the team building Misty — what we’re making, what changed our minds, and what’s next.",
    changelog:
      "Every Misty release and the changes that shipped with it, newest first.",
    roadmap:
      "What’s available in the Misty beta today, what’s in pilot, and what’s still planned.",
    waitlist:
      "Sign in to Misty and join your group in one shared Space for files, conversations, tools, tasks, and Agents.",
  },
};
