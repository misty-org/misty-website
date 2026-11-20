type PhaseStatus = "available" | "pilot" | "development";

interface RoadmapItem {
  title: string;
  description: string;
}

interface RoadmapPhase {
  label: string;
  status: PhaseStatus;
  items: RoadmapItem[];
}

export const phases: RoadmapPhase[] = [
  {
    label: "Available in beta",
    status: "available",
    items: [
      {
        title: "Shared spaces",
        description: "Create a space and manage members.",
      },
      {
        title: "Space chat",
        description: "Shared, group, and direct messages.",
      },
      {
        title: "Lab and Code",
        description: "Notebooks from your sources, and your projects.",
      },
      {
        title: "Files",
        description: "The space's drive, on your computer too.",
      },
      {
        title: "Private files",
        description: "Local and connected files stay private until shared.",
      },
      {
        title: "Public desktop builds",
        description: "Apple Silicon macOS and Windows x64.",
      },
    ],
  },
  {
    label: "Limited pilot",
    status: "pilot",
    items: [
      {
        title: "Space-scoped agents",
        description: "Limited beta; availability varies.",
      },
      {
        title: "Open-source apps",
        description: "Added to a space from their GitHub link.",
      },
      {
        title: "Slack and Notion connections",
        description: "Not generally available.",
      },
      {
        title: "Discord connection",
        description: "Not available yet.",
      },
    ],
  },
  {
    label: "In development",
    status: "development",
    items: [
      {
        title: "Tablet builds",
        description: "No public build yet.",
      },
      {
        title: "Broader integration access",
        description: "Self-service setup and hardening.",
      },
      {
        title: "Beta reliability",
        description: "Accounts, providers, and packaging.",
      },
    ],
  },
];
