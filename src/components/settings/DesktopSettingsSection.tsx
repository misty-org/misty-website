import type { ReactNode } from "react";

export function DesktopSettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-6 min-w-0 last:mb-0">
      <div className="mb-3 min-w-0">
        <h2 className="text-sm font-semibold leading-5 text-foreground">{title}</h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-[13px] leading-[18px] text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-lg border border-border/80 bg-card">
        {children}
      </div>
    </section>
  );
}
