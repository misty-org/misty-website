import type { ReactNode } from "react";

import {
  DesktopSettingsRow,
  DesktopSettingsSection,
} from "@/components/settings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/** Padding for rows that hold custom content instead of a label/value pair. */
export const customRowClass =
  "border-b border-border px-5 py-4 last:border-b-0";

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return <DesktopSettingsSection title={title}>{children}</DesktopSettingsSection>;
}

export function Row({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <DesktopSettingsRow label={label} description={description}>
      <span className="text-right text-sm text-foreground max-[760px]:text-left">
        {children}
      </span>
    </DesktopSettingsRow>
  );
}

export function GhostRow({ label, value }: { label: string; value: string }) {
  return (
    <DesktopSettingsRow label={label}>
      <span className="text-sm italic text-muted-foreground">{value}</span>
    </DesktopSettingsRow>
  );
}

export function ErrorRow({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className={customRowClass}>
      <Alert variant="destructive">
        <AlertTitle>{title}</AlertTitle>
        {onRetry ? (
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            <span>{message}</span>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Try again
            </Button>
          </AlertDescription>
        ) : (
          <AlertDescription>{message}</AlertDescription>
        )}
      </Alert>
    </div>
  );
}
