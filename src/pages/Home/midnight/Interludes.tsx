import { Fragment, type CSSProperties } from "react";

/**
 * The story is an equation: browser + work + space. A one-line interlude opens each part with its
 * term written in the highlighted serif, and the finale lines the three terms up. Each term keeps
 * one marker color everywhere it appears.
 */

type Term = "browser" | "work" | "space";
const TERMS: Term[] = ["browser", "work", "space"];
const TONE: Record<Term, string> = { browser: "yellow", work: "blue", space: "green" };

export function Interlude({ term, lead, before }: { term: Term; lead?: string; before: string }) {
  return (
    <section id={term} className="mist-interlude" aria-labelledby={`${term}-interlude-title`}>
      <div className="mist-container mist-interlude-copy">
        {lead && <p className="mist-interlude-lead" data-reveal>{lead}</p>}
        {/* Written out left to right like the hero. The period sits after the marker, never inside it. */}
        <h2 id={`${term}-interlude-title`} data-write>{before}{" "}<mark className="mist-marker" data-tone={TONE[term]}>{term}</mark>.</h2>
      </div>
    </section>
  );
}

/** The finale: the three terms in a row, each linking back to the part that explained it. */
export function Equation() {
  return (
    <section id="equation" className="mist-equation" aria-labelledby="equation-title">
      <div className="mist-container">
        <h2 id="equation-title" data-write>
          {TERMS.map((term, index) => (
            <Fragment key={term}>
              {index > 0 && " "}
              <span className="mist-eq-term" style={{ "--i": index } as CSSProperties}>
                {index > 0 && <><i>+</i>{" "}</>}
                <a href={`#${term}`} aria-label={`${term}, back to that part`}><mark className="mist-marker" data-tone={TONE[term]}>{term}</mark></a>
              </span>
            </Fragment>
          ))}
        </h2>
      </div>
    </section>
  );
}
