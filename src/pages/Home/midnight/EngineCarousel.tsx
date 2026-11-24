import { Mark } from "@misty/ui";

const ENGINES: readonly { id: string; name: string }[] = [
  { id: "claude", name: "Claude Code" },
  { id: "codex", name: "Codex" },
  { id: "agy", name: "Antigravity" },
];

export function EngineCarousel() {
  return (
    <section className="mist-interlude mist-engines" aria-labelledby="engines-title">
      <div className="mist-container mist-interlude-copy">
        <h2 id="engines-title" data-reveal>Works with Claude Code, Codex and Antigravity</h2>
      </div>
      <div className="mist-container">
        <ul className="brand-marquee-list flex-wrap justify-center">
          {ENGINES.map(engine => (
            <li key={engine.id} className="brand-marquee-item">
              <span className="brand-marquee-link"><Mark of={`engine:${engine.id}`} size={20} />{engine.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
