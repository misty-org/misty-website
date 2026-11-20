import type { ReactNode } from "react";

/** A plain header over one panel of rows, the same as the app's settings sections. */
export function DesktopSettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-8 min-w-0 last:mb-0">
      <h2 className="mb-3 min-w-0 text-body font-semibold leading-6 text-foreground">
        {title}
      </h2>
      <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
        {children}
      </div>
    </section>
  );
}
