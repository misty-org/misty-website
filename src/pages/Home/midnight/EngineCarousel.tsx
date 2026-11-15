import { EngineMark } from "./EngineMark";

/**
 * Every engine Misty runs, as an endless row under the hero screenshot. Names and order follow the
 * app's Settings (misty/src/features/engine-config/channels/engines.ts); Qoder's China build is the
 * same CLI, so it is left out. The row is drawn twice and slides by half its width, so it loops with
 * no seam; reduced motion leaves it still and scrollable (index.css .brand-marquee).
 */
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
      {/* Set like the Spaces interlude, and written out the same way as it arrives. */}
      <div className="mist-container mist-interlude-copy">
        <h2 id="engines-title" data-write>Works with your favorite agents</h2>
      </div>
      <div className="mist-container">
        <div className="brand-marquee">
          <div className="brand-marquee-track" style={{ ["--brand-marquee-duration" as string]: "48s" }}>
            {[0, 1].map(copy => (
              <ul key={copy} className="brand-marquee-list" aria-hidden={copy === 1 || undefined}>
                {ENGINES.map(engine => (
                  <li key={engine.id} className="brand-marquee-item">
                    <span className="brand-marquee-link"><EngineMark engine={engine.id} size={20} />{engine.name}</span>
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
