import {
  Fragment,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronDown, X, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DesktopSettingsNavEntry<Id extends string = string> {
  id: Id;
  label: string;
  icon: LucideIcon;
  group?: string;
  groupLabel?: string;
  iconClassName?: string;
}

interface DesktopSettingsFrameProps<Id extends string> {
  activeId: Id;
  ariaLabel: string;
  children: ReactNode;
  items: readonly DesktopSettingsNavEntry<Id>[];
  navigationLabel: string;
  onClose?: () => void;
  onSelect: (id: Id) => void;
  presentation?: "page" | "overlay";
  title: ReactNode;
}

/**
 * The website counterpart to Misty's desktop settings frame. Group captions,
 * tree branches, density, and content measurements intentionally follow the
 * app; the rail becomes a horizontal section picker on phone-sized screens.
 */
export function DesktopSettingsFrame<Id extends string>({
  activeId,
  ariaLabel,
  children,
  items,
  navigationLabel,
  onClose,
  onSelect,
  presentation = "page",
  title,
}: DesktopSettingsFrameProps<Id>) {
  const overlay = presentation === "overlay";
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    () => new Set(),
  );
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 640px)").matches) return;
    activeButtonRef.current?.scrollIntoView({
      behavior: "instant",
      block: "nearest",
      inline: "center",
    });
  }, [activeId]);

  function toggleGroup(group: string) {
    setCollapsedGroups((current) => {
      const next = new Set(current);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }

  return (
    <div
      aria-label={ariaLabel}
      className={cn(
        "account-settings grid min-h-0 min-w-0",
        overlay ? "h-full" : "h-[calc(100dvh-4rem)]",
        "grid-cols-[216px_1px_minmax(0,1fr)] overflow-hidden bg-background",
        "max-[900px]:grid-cols-[184px_1px_minmax(0,1fr)]",
        "max-[680px]:grid-cols-[156px_1px_minmax(0,1fr)]",
        "max-[640px]:grid-cols-1 max-[640px]:grid-rows-[48px_auto_minmax(0,1fr)]",
      )}
    >
      <aside className="min-h-0 overflow-y-auto overscroll-contain bg-sidebar px-3 py-3.5 text-sidebar-foreground [scrollbar-gutter:stable] max-[680px]:px-2 max-[640px]:order-2 max-[640px]:min-h-14 max-[640px]:overflow-x-auto max-[640px]:overflow-y-hidden max-[640px]:border-b max-[640px]:border-border max-[640px]:px-2 max-[640px]:py-1.5 max-[640px]:[scrollbar-gutter:auto]">
        <nav aria-label={navigationLabel} className="flex min-h-0 flex-col">
          <div className="grid gap-1 max-[640px]:flex max-[640px]:w-max max-[640px]:gap-1">
            {items.map((item, index) => {
              const Icon = item.icon;
              const active = item.id === activeId;
              const startsGroup =
                item.group !== undefined &&
                item.group !== items[index - 1]?.group;
              const endsGroup =
                item.group !== undefined &&
                item.group !== items[index + 1]?.group;
              const groupCollapsed = item.group
                ? collapsedGroups.has(item.group)
                : false;

              return (
                <Fragment key={item.id}>
                  {startsGroup && item.groupLabel ? (
                    <h2
                      className={cn(
                        "flex h-8 shrink-0 items-center max-[640px]:hidden",
                        index > 0 && "mt-2.5",
                      )}
                    >
                      <button
                        type="button"
                        aria-expanded={!groupCollapsed}
                        aria-label={`${groupCollapsed ? "Expand" : "Collapse"} ${item.groupLabel} settings`}
                        className="flex h-8 w-full min-w-0 items-center gap-1 rounded-md px-3 text-left text-[13px] font-semibold text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() => item.group && toggleGroup(item.group)}
                      >
                        <span className="truncate">{item.groupLabel}</span>
                        <ChevronDown
                          aria-hidden="true"
                          className={cn(
                            "size-4 shrink-0 transition-transform duration-150 motion-reduce:transition-none",
                            groupCollapsed && "-rotate-90",
                          )}
                          strokeWidth={1.8}
                        />
                      </button>
                    </h2>
                  ) : null}

                  <Button
                    ref={active ? activeButtonRef : undefined}
                    type="button"
                    variant="ghost"
                    aria-current={active ? "page" : undefined}
                    aria-label={item.label}
                    title={item.label}
                    onClick={() => onSelect(item.id)}
                    className={cn(
                      "group/settings-row relative ml-6 mr-2 h-8 w-[calc(100%-2rem)] justify-start gap-0 rounded-md !bg-transparent p-0 text-[13px] font-medium text-muted-foreground shadow-none transition-colors hover:!bg-transparent hover:text-foreground",
                      "focus-visible:ring-2 focus-visible:ring-ring",
                      "max-[640px]:ml-0 max-[640px]:mr-0 max-[640px]:h-11 max-[640px]:w-auto max-[640px]:shrink-0",
                      groupCollapsed && "min-[641px]:hidden",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 -left-2 w-3 max-[640px]:hidden"
                    >
                      {endsGroup ? (
                        <span
                          className={cn(
                            "absolute bottom-1/2 left-0 w-3 rounded-bl-[3px] border-b border-l border-border/80",
                            startsGroup ? "top-0.5" : "-top-0.5",
                          )}
                        />
                      ) : (
                        <>
                          <span
                            className={cn(
                              "absolute -bottom-0.5 left-0 w-px bg-border/80",
                              startsGroup ? "top-0.5" : "-top-0.5",
                            )}
                          />
                          <span className="absolute left-0 top-1/2 h-px w-3 bg-border/80" />
                        </>
                      )}
                    </span>

                    <span
                      data-settings-nav-surface="true"
                      className={cn(
                        "ml-1 grid h-full min-w-0 flex-1 grid-cols-[24px_minmax(0,1fr)] items-center gap-2.5 rounded-md px-2.5 group-hover/settings-row:bg-[var(--settings-nav-hover)]",
                        "max-[640px]:ml-0 max-[640px]:flex max-[640px]:gap-2 max-[640px]:px-3",
                        active &&
                          "bg-[var(--settings-nav-selected)] text-sidebar-accent-foreground group-hover/settings-row:bg-[var(--settings-nav-selected)]",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center",
                          item.iconClassName,
                        )}
                      >
                        <Icon
                          aria-hidden="true"
                          className="size-5"
                          strokeWidth={1.85}
                        />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-left">
                        {item.label}
                      </span>
                    </span>
                  </Button>
                </Fragment>
              );
            })}
          </div>
        </nav>
      </aside>

      <div aria-hidden="true" className="bg-border max-[640px]:hidden" />

      <main className="flex min-h-0 min-w-0 flex-col bg-background max-[640px]:contents">
        <header className="shrink-0 border-b border-border/60 bg-background max-[640px]:order-1">
          <div className="flex min-h-12 min-w-0 items-center gap-3 px-5 py-2 max-[720px]:px-4">
            <div className="min-w-0 flex-1">
              <h1 className="min-w-0 truncate text-base font-semibold leading-6 text-foreground">
                {title}
              </h1>
            </div>
            {overlay ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Close ${ariaLabel.toLowerCase()}`}
                onClick={onClose}
                className="shrink-0"
              >
                <X aria-hidden="true" className="size-4" strokeWidth={1.8} />
              </Button>
            ) : null}
          </div>
        </header>

        <div
          className={cn(
            "mx-auto min-h-0 min-w-0 w-full flex-1 overflow-y-auto overscroll-contain p-5 max-[720px]:p-4 max-[640px]:order-3",
            overlay ? "max-w-[760px]" : "max-w-[860px]",
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
