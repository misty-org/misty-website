import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function DesktopSettingsRow({
  label,
  description,
  children,
  last,
  muted,
}: {
  label: string;
  description?: string;
  children: ReactNode;
  last?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      aria-disabled={muted || undefined}
      className={cn(
        "grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-8 gap-y-3 border-b border-border px-5 py-3 last:border-b-0",
        "max-[760px]:grid-cols-1 max-[760px]:items-start",
        last && "border-b-0",
      )}
    >
      <div className="grid min-w-0 gap-1">
        <strong
          className={cn(
            "text-[15px] font-medium leading-6",
            muted ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {label}
        </strong>
        {description ? (
          <span className="text-sm leading-[22px] text-muted-foreground">
            {description}
          </span>
        ) : null}
      </div>
      <div className="flex min-w-0 items-center justify-end max-[760px]:w-full max-[760px]:justify-start">
        {children}
      </div>
    </div>
  );
}
