import type { PhaseStatus } from "@/pages/Roadmap/data";

export const capabilities = [
  { name: "Browser", description: "Your websites, grouped around your work." },
  { name: "Notes", description: "Your ideas beside your browsing." },
  { name: "Planner", description: "Tasks, agenda, and roadmaps." },
  { name: "Files", description: "Local and connected, still yours." },
  { name: "Spaces", description: "Shared context when you need it." },
  { name: "Agents", description: "Help across the workspace." },
];

export const roadmapPreview: { status: PhaseStatus; label: string }[] = [
  { status: "available", label: "Shipped" },
  { status: "pilot", label: "In progress" },
  { status: "development", label: "Planned" },
];
