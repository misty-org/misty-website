/**
 * The story has three parts: browser, work and space. A one-line interlude opens each part with its
 * term written in the highlighted serif. Each term keeps one marker color everywhere it appears.
 */

type Term = "browser" | "work" | "space";
const TONE: Record<Term, string> = { browser: "yellow", work: "blue", space: "green" };

export function Interlude({ term, before, after }: { term: Term; before: string; after?: string }) {
  return (
    <section id={term} className="mist-interlude" aria-labelledby={`${term}-interlude-title`}>
      <div className="mist-container mist-interlude-copy">
        {/* Written out left to right like the hero, with no closing period. */}
        <h2 id={`${term}-interlude-title`} data-write>{before}{" "}<mark className="mist-marker" data-tone={TONE[term]}>{term}</mark>{after && <>{" "}{after}</>}</h2>
      </div>
    </section>
  );
}
