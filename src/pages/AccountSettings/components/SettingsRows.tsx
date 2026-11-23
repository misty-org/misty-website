import type { ReactNode } from "react";

import {
  DesktopSettingsRow,
  DesktopSettingsSection,
} from "@/components/settings";
import { ErrorState, Text } from "@misty/ui";

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
      <Text bare size="control" tone="default" className="text-right max-[836px]:text-left">
        {children}
      </Text>
    </DesktopSettingsRow>
  );
}

export function GhostRow({ label, value }: { label: string; value: string }) {
  return (
    <DesktopSettingsRow label={label}>
      <Text bare size="control" tone="muted">
        {value}
      </Text>
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
      <ErrorState
        inline
        title={title}
        line={message}
        action={onRetry ? { label: "Try again", onClick: onRetry, variant: "secondary" } : undefined}
      />
    </div>
  );
}
