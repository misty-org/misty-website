import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "grid gap-8 pb-12 md:grid-cols-[1fr_auto] md:items-end",
        className,
      )}
    >
      <h1 className="max-w-3xl marketing-heading text-foreground">{title}</h1>
      {action ? <div>{action}</div> : null}
    </header>
  );
}
