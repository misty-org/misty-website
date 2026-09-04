import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "spaces", label: "Spaces" },
  { id: "features", label: "Features" },
  { id: "updates", label: "Updates" },
] as const;
type SectionId = (typeof sections)[number]["id"];

function jumpTop(id: SectionId) {
  const target = document.getElementById(id);
  if (!target) return null;

  const targetTop = window.scrollY + target.getBoundingClientRect().top;
  return Math.max(0, targetTop - 96);
}

export function SectionJumper() {
  const [activeId, setActiveId] = useState<SectionId>("overview");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const targets = sections
      .map(({ id }) => document.getElementById(id))
      .filter((target): target is HTMLElement => Boolean(target));
    let frame = 0;

    const measure = () => {
      frame = 0;
      const activationLine = window.innerHeight * 0.42;
      let nextId: SectionId = sections[0].id;

      targets.forEach((target) => {
        if (target.getBoundingClientRect().top <= activationLine) {
          nextId = target.id as SectionId;
        }
      });

      setActiveId((current) => (current === nextId ? current : nextId));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const settleHashTarget = () => {
      const id = window.location.hash.slice(1) as SectionId;
      if (!sections.some((section) => section.id === id)) return;

      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const top = jumpTop(id);
        if (top !== null) window.scrollTo({ top, behavior: "auto" });
      });
    };

    settleHashTarget();
    window.addEventListener("hashchange", settleHashTarget);
    window.addEventListener("popstate", settleHashTarget);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", settleHashTarget);
      window.removeEventListener("popstate", settleHashTarget);
    };
  }, []);

  const jumpTo = (id: SectionId) => {
    const top = jumpTop(id);
    if (top === null) return;

    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `#${id}`);
    }
    window.scrollTo({ top, behavior: "auto" });
    setActiveId(id);
  };

  return (
    <Sheet
      open={open}
      modal={false}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setOpen(true);
      }}
    >
      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-40 xl:bottom-auto xl:top-1/2 xl:-translate-y-1/2">
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon-lg"
            aria-label="Open section menu"
            className="size-11 rounded-xl border-[var(--marketing-border)] bg-[var(--marketing-surface)] text-[var(--marketing-foreground)] shadow-xl backdrop-blur-xl data-[state=open]:pointer-events-none data-[state=open]:opacity-0 hover:bg-[var(--marketing-border)]"
          >
            <Menu aria-hidden="true" className="size-5" />
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent
        side="left"
        showOverlay={false}
        showCloseButton={false}
        aria-describedby={undefined}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        className="pointer-events-none w-52 gap-0 border-none bg-transparent p-0 shadow-none sm:max-w-none"
      >
        <div className="pointer-events-auto absolute left-4 top-1/2 w-44 -translate-y-1/2 rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-surface)] p-1.5 text-[var(--marketing-foreground)] shadow-xl backdrop-blur-xl">
          <SheetHeader className="flex-row items-center justify-between gap-3 px-2 py-1.5">
            <SheetTitle className="text-xs font-medium text-[var(--marketing-muted)]">
              Jump to
            </SheetTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setOpen(false)}
              aria-label="Close section menu"
              className="text-[var(--marketing-muted)] hover:bg-[var(--marketing-border)] hover:text-[var(--marketing-foreground)]"
            >
              <X aria-hidden="true" className="size-4" />
            </Button>
          </SheetHeader>

          <nav aria-label="On this page">
            <ul className="grid gap-1">
              {sections.map(({ id, label }) => {
                const active = id === activeId;

                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      aria-current={active ? "location" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        jumpTo(id);
                      }}
                      className={`flex items-center whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        active
                          ? "bg-[var(--marketing-foreground)] text-background"
                          : "text-[var(--marketing-muted)] hover:bg-[var(--marketing-border)] hover:text-[var(--marketing-foreground)]"
                      }`}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
