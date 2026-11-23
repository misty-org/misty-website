import { type ReactNode } from "react";
import { X, type LucideIcon } from "lucide-react";

import { IconButton, NavGroupHeading, NavList, NavRow, OverflowFadeText, Text } from "@misty/ui";

import { cn } from "@/lib/utils";

interface DesktopSettingsNavEntry<Id extends string = string> {
  id: Id;
  label: string;
  icon: LucideIcon;
}

interface DesktopSettingsNavGroup<Id extends string = string> {
  label: string;
  items: readonly DesktopSettingsNavEntry<Id>[];
}

interface DesktopSettingsFrameProps<Id extends string> {
  activeId: Id;
  ariaLabel: string;
  children: ReactNode;
  groups: readonly DesktopSettingsNavGroup<Id>[];
  navigationLabel: string;
  onClose: () => void;
  onSelect: (id: Id) => void;
  title: ReactNode;
}

export function DesktopSettingsFrame<Id extends string>({
  activeId,
  ariaLabel,
  children,
  groups,
  navigationLabel,
  onClose,
  onSelect,
  title,
}: DesktopSettingsFrameProps<Id>) {
  return (
    <div
      aria-label={ariaLabel}
      className={cn(
        "account-settings grid h-full min-h-0 min-w-0 overflow-hidden bg-background",
        "grid-cols-[15.5rem_1px_minmax(0,1fr)]",
        "max-[990px]:grid-cols-[13rem_1px_minmax(0,1fr)]",
        "max-[748px]:grid-cols-[10.5rem_1px_minmax(0,1fr)]",
        "max-[704px]:grid-cols-1 max-[704px]:grid-rows-[auto_minmax(0,1fr)]",
      )}
    >
      <aside className="min-h-0 overflow-y-auto overscroll-contain bg-sidebar px-3 py-3 text-sidebar-foreground max-[748px]:px-2 max-[704px]:overflow-x-auto max-[704px]:overflow-y-hidden max-[704px]:border-b max-[704px]:border-border max-[704px]:py-1.5">
        <nav
          aria-label={navigationLabel}
          className="max-[704px]:flex max-[704px]:w-max max-[704px]:gap-1"
        >
          {groups.map((group) => (
            <div
              key={group.label}
              role="group"
              aria-label={group.label}
              className="pb-3 max-[704px]:contents"
            >
              <NavGroupHeading name={group.label} tone="page" className="max-[704px]:hidden" />
              <NavList className="max-[704px]:contents">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavRow
                      key={item.id}
                      tone="page"
                      current={item.id === activeId}
                      onClick={() => onSelect(item.id)}
                      className="max-[704px]:w-auto max-[704px]:shrink-0"
                    >
                      <Icon aria-hidden="true" />
                      <OverflowFadeText>{item.label}</OverflowFadeText>
                    </NavRow>
                  );
                })}
              </NavList>
            </div>
          ))}
        </nav>
      </aside>

      <div aria-hidden="true" className="bg-border max-[704px]:hidden" />

      <main className="flex min-h-0 min-w-0 flex-col bg-background">
        <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border pl-10 pr-4 max-[792px]:pl-6">
          <Text as="h1" size="body" weight="semibold" tone="bright" className="min-w-0">
            {title}
          </Text>
          <IconButton label={`Close ${ariaLabel.toLowerCase()}`} onClick={onClose}>
            <X aria-hidden="true" />
          </IconButton>
        </header>
        <div className="mb-3 min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="w-full px-10 pb-12 pt-6 max-[792px]:px-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
