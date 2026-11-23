import type { ReactNode } from "react";

export function ChapterHead({ id, title }: { id: string; title: ReactNode }) {
  return <h2 id={`${id}-title`} className="mist-chapter-title sr-only">{title}</h2>;
}

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
