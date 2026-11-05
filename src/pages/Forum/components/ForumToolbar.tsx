import { ArrowUp, Flame, Search, TrendingUp } from "lucide-react";

import type { SortKey } from "../types";

const sortOptions: { key: SortKey; label: string; icon: React.ReactNode }[] = [
  {
    key: "latest",
    label: "Latest",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
  },
  {
    key: "popular",
    label: "Popular",
    icon: <Flame className="w-3.5 h-3.5" />,
  },
  {
    key: "top",
    label: "Most Replies",
    icon: <ArrowUp className="w-3.5 h-3.5" />,
  },
];

export default function ForumToolbar({
  search,
  sort,
  onSearchChange,
  onSortChange,
}: {
  search: string;
  sort: SortKey;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortKey) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search threads..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-surface text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <div className="flex items-center gap-1">
        {sortOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => onSortChange(option.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              sort === option.key
                ? "bg-elevated text-text"
                : "text-text-muted hover:text-text"
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
