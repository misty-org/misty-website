import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const publicPageContainer = "site-container";

export function PublicPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(publicPageContainer, "pb-24 pt-8 sm:pt-12", className)}>
      {children}
    </div>
  );
}
