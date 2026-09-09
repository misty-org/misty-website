import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type HomeSection = {
  readonly id: string;
  readonly label: string;
};

export const HOME_SECTIONS: readonly HomeSection[] = [
  { id: "overview", label: "Overview" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "features", label: "How it works" },
  { id: "foundation", label: "Our goal" },
  { id: "resources", label: "Resources" },
  { id: "get-started", label: "Get started" },
];

export function AnchorDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("overview");
  const drawerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  // Scroll spy to determine currently visible section
  useEffect(() => {
    function calculateActiveSection() {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // If scrolled near bottom, activate get-started
      if (window.scrollY + winHeight >= docHeight - 80) {
        setActiveId("get-started");
        return;
      }

      // If at top of the page, activate overview
      if (window.scrollY < 200) {
        setActiveId("overview");
        return;
      }

      const scrollPosition = window.scrollY + winHeight * 0.45;

      let current = HOME_SECTIONS[0].id;
      for (const section of HOME_SECTIONS) {
        if (section.id === "overview") continue;
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            current = section.id;
          }
        }
      }
      setActiveId(current);
    }

    calculateActiveSection();
    window.addEventListener("scroll", calculateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", calculateActiveSection);
  }, []);

  // Close drawer on click outside or Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const scrollToSection = (id: string) => {
    setIsOpen(false);

    if (id === "overview" || id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;

    if (id === "ecosystem") {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Drag handlers for pull tab
  const handleTabPointerDown = (e: React.PointerEvent) => {
    startXRef.current = e.clientX;
    isDraggingRef.current = false;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startXRef.current;
      if (!isOpen && deltaX > 15) {
        isDraggingRef.current = true;
        setIsOpen(true);
        cleanup();
      } else if (isOpen && deltaX < -15) {
        isDraggingRef.current = true;
        setIsOpen(false);
        cleanup();
      }
    };

    const handlePointerUp = () => {
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <aside
      ref={drawerRef}
      aria-label="Page section navigation"
      className={cn(
        "fixed left-0 top-1/2 z-40 -translate-y-1/2 select-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Drawer Section Panel */}
      <div className="w-48 rounded-r-2xl border border-l-0 border-[var(--marketing-border)] bg-[var(--marketing-surface)]/98 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <nav aria-label="Section anchors" className="flex flex-col gap-0.5">
          {HOME_SECTIONS.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-left text-sm transition-all",
                  isActive
                    ? "bg-[var(--marketing-border)]/70 font-medium text-[var(--marketing-foreground)]"
                    : "text-[var(--marketing-muted)] hover:bg-[var(--marketing-border)]/30 hover:text-[var(--marketing-foreground)]",
                )}
                aria-current={isActive ? "location" : undefined}
              >
                <span className="truncate">{section.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pull Tab Handle on the middle right */}
      <button
        type="button"
        onPointerDown={handleTabPointerDown}
        onClick={() => {
          if (!isDraggingRef.current) {
            setIsOpen((prev) => !prev);
          }
        }}
        className="group absolute left-full top-1/2 -ml-px flex h-16 w-6 -translate-y-1/2 items-center justify-center rounded-r-xl border border-l-0 border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 shadow-xl shadow-black/25 backdrop-blur-xl transition-all duration-200 hover:w-7 hover:bg-neutral-800 dark:hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={isOpen ? "Collapse section drawer" : "Open section drawer"}
        title={isOpen ? "Collapse drawer" : "Jump to section"}
      >
        {isOpen ? (
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
        ) : (
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        )}
      </button>
    </aside>
  );
}
