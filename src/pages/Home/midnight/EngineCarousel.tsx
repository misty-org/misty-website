import { Mark } from "@misty/ui";

const ENGINES: readonly { id: string; name: string }[] = [
  { id: "claude", name: "Claude Code" },
  { id: "codex", name: "Codex" },
  { id: "agy", name: "Antigravity" },
  { id: "opencode", name: "OpenCode" },
  { id: "gemini", name: "Gemini CLI" },
  { id: "qwen", name: "Qwen Code" },
  { id: "kimi", name: "Kimi CLI" },
  { id: "grok", name: "Grok CLI" },
  { id: "minimax", name: "MiniMax Code" },
  { id: "qoder", name: "Qoder CLI" },
  { id: "codebuddy", name: "CodeBuddy" },
  { id: "omp", name: "Oh My Pi" },
  { id: "pi", name: "Pi" },
  { id: "dsh", name: "DeepSeek Harness" },
  { id: "hermes", name: "Hermes Agent" },
];

export function EngineCarousel() {
  return (
    <section className="mist-interlude mist-engines" aria-labelledby="engines-title">
      <div className="mist-container mist-interlude-copy">
        <h2 id="engines-title" data-reveal>Works with your favorite engines</h2>
      </div>
      <div className="mist-container">
        <div className="brand-marquee">
          <div className="brand-marquee-track" style={{ ["--brand-marquee-duration" as string]: "48s" }}>
            {[0, 1].map(copy => (
              <ul key={copy} className="brand-marquee-list" aria-hidden={copy === 1 || undefined}>
                {ENGINES.map(engine => (
                  <li key={engine.id} className="brand-marquee-item">
                    <span className="brand-marquee-link"><Mark of={`engine:${engine.id}`} size={20} />{engine.name}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
