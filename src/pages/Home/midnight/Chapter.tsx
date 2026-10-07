import type { ReactNode } from "react";

/** Opens a chapter with its heading alone, on the chapter's side of the page (see midnight.css). */
export function ChapterHead({ id, title }: { id: string; title: ReactNode }) {
  return (
    <header className="mist-chapter-head" data-reveal>
      <h2 id={`${id}-title`}>{title}</h2>
    </header>
  );
}

/**
 * One chapter of the story. Heads alternate sides down the page; `side="end"` puts this one on
 * the right. `ownHead` chapters place <ChapterHead> themselves, e.g. inside a pinned scene.
 */
export function Chapter({ id, title, side = "start", ownHead = false, children }: {
  id: string; title: ReactNode; side?: "start" | "end"; ownHead?: boolean; children: ReactNode;
}) {
  return (
    <section id={id} className="mist-chapter mist-section" data-side={side} aria-labelledby={`${id}-title`} data-mist-scene>
      <div className="mist-container">
        {!ownHead && <ChapterHead id={id} title={title} />}
        {children}
      </div>
    </section>
  );
}
