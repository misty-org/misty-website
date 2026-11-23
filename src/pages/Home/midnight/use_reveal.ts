import { useEffect, type RefObject } from "react";

export function useReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.revealed = "true";
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -4% 0px" });
    const SELECTOR = "[data-reveal], [data-reveal-stagger]";
    const watch = (scope: Element) => {
      const targets = [...scope.querySelectorAll<HTMLElement>(SELECTOR)];
      if (scope.matches(SELECTOR)) targets.push(scope as HTMLElement);
      for (const target of targets) {
        if (target.dataset.revealed) continue;
        if (target.hasAttribute("data-reveal-stagger")) {
          [...target.children].forEach((child, index) => (child as HTMLElement).style.setProperty("--i", String(index)));
        }
        observer.observe(target);
      }
    };
    watch(element);
    const mutations = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "attributes") watch(record.target as Element);
        else record.addedNodes.forEach(node => { if (node instanceof Element) watch(node); });
      }
    });
    mutations.observe(element, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-reveal", "data-reveal-stagger"] });
    element.setAttribute("data-motion", "ready");

    const spotlight = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };
    element.addEventListener("pointermove", spotlight, { passive: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
      element.removeEventListener("pointermove", spotlight);
      element.removeAttribute("data-motion");
    };
  }, [root]);
}
