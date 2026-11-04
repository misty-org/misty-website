import { type ReactNode } from "react";
import { X, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DesktopSettingsNavEntry<Id extends string = string> {
  id: Id;
  label: string;
  icon: LucideIcon;
}

export interface DesktopSettingsNavGroup<Id extends string = string> {
  /** A plain muted label naming the feature the pages belong to. */
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
  /** The page we're on, in the header over the content. */
  title: ReactNode;
}

/**
 * The website counterpart to Misty's desktop settings frame: pages under plain group labels, one
 * row per page, and one scrolling page of panels under a header naming the page. Keep it in step with
 * `src/features/settings/components/` in the app. On phones the rail becomes a horizontal picker.
 */
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
        "grid-cols-[248px_1px_minmax(0,1fr)]",
        "max-[900px]:grid-cols-[208px_1px_minmax(0,1fr)]",
        "max-[680px]:grid-cols-[168px_1px_minmax(0,1fr)]",
        "max-[640px]:grid-cols-1 max-[640px]:grid-rows-[auto_minmax(0,1fr)]",
      )}
    >
      <aside className="min-h-0 overflow-y-auto overscroll-contain bg-sidebar px-3 py-3 text-sidebar-foreground max-[680px]:px-2 max-[640px]:overflow-x-auto max-[640px]:overflow-y-hidden max-[640px]:border-b max-[640px]:border-border max-[640px]:py-1.5">
        <nav
          aria-label={navigationLabel}
          className="max-[640px]:flex max-[640px]:w-max max-[640px]:gap-1"
        >
          {groups.map((group) => (
            <div
              key={group.label}
              role="group"
              aria-label={group.label}
              className="pb-3 max-[640px]:contents"
            >
              <p className="px-2.5 pb-1.5 pt-2 text-[13px] leading-5 text-muted-foreground max-[640px]:hidden">
                {group.label}
              </p>
              <div className="grid gap-0.5 max-[640px]:contents">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-current={active ? "page" : undefined}
                      onClick={() => onSelect(item.id)}
                      className={cn(
                        "flex h-9 w-full min-w-0 items-center gap-3 rounded-lg px-2.5 text-left text-[15px] leading-5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring max-[640px]:w-auto max-[640px]:shrink-0",
                        active
                          ? "bg-[var(--settings-nav-selected)] text-sidebar-accent-foreground"
                          : "hover:bg-[var(--settings-nav-hover)]",
                      )}
                    >
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.75}
                        className={cn(
                          "size-[18px] shrink-0",
                          !active && "text-muted-foreground",
                        )}
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div aria-hidden="true" className="bg-border max-[640px]:hidden" />

      <main className="flex min-h-0 min-w-0 flex-col bg-background">
        {/* The page we're on, over a divider; the page scrolls under it, never behind it. */}
        <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border pl-10 pr-4 max-[720px]:pl-6">
          <h1 className="min-w-0 truncate text-[15px] font-semibold leading-6 text-foreground">
            {title}
          </h1>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Close ${ariaLabel.toLowerCase()}`}
            onClick={onClose}
          >
            <X aria-hidden="true" className="size-4" strokeWidth={1.8} />
          </Button>
        </header>
        <div className="mb-3 min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="w-full px-10 pb-12 pt-6 max-[720px]:px-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
