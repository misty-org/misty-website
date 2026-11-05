import { Bug, Lightbulb, Megaphone, MessageSquare, MessagesSquare } from "lucide-react";

import type { Category } from "../types";

export type CategoryFilter = Category | "all";

const categories: {
  key: CategoryFilter;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "all",
    label: "All",
    icon: <MessagesSquare className="w-4 h-4" />,
  },
  {
    key: "general",
    label: "General",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    key: "feature-requests",
    label: "Feature Requests",
    icon: <Lightbulb className="w-4 h-4" />,
  },
  {
    key: "bug-reports",
    label: "Bug Reports",
    icon: <Bug className="w-4 h-4" />,
  },
  {
    key: "show-and-tell",
    label: "Show & Tell",
    icon: <Megaphone className="w-4 h-4" />,
  },
];

export default function CategoryTabs({
  active,
  onChange,
}: {
  active: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-6 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.key}
          onClick={() => onChange(category.key)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            active === category.key
              ? "bg-primary/10 text-primary"
              : "text-text-muted hover:text-text hover:bg-elevated"
          }`}
        >
          {category.icon}
          {category.label}
        </button>
      ))}
    </div>
  );
}
