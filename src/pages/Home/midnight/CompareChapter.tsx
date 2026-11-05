import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import { Chapter } from "./Chapter";
import "./compare.css";

/**
 * Why another AI browser: Misty beside the AI browsers and chat apps people already pay for.
 * Every competitor cell comes from that company's own pages (see COMPARE_SOURCES and
 * misty/docs/plans/ai-browser-comparison.md). Add a row only when every cell is a plain yes, no or
 * short fact, and recheck the cells before each release.
 */

const PRODUCTS = ["Misty", "Comet", "Polar", "Dia", "ChatGPT", "Claude"] as const;

const yes = { yes: true } as const;
const no = { yes: false } as const;
type Cell = string | typeof yes | typeof no;

/**
 * Agent and browser features, including rows Misty loses. Each cell comes from that company's own
 * pages (read October 11, 2026) or misty/docs/competitors.md; "Not stated" means the company's pages
 * don't say, and "Not checked" means nobody has read them for that row.
 * - Model for each job: only Misty sets separate models for thinking, seeing, listening and speaking.
 * - Model makers: Misty takes your own key from any major model provider.
 * - Free browser agent: Misty is free and open source, and you pay only your model provider. Perplexity lists Comet's browser agent as "No" on Free; Polar's free plan
 *   runs on credits; Dia's plans describe no agent; ChatGPT Work is "Limited" below Plus; Claude in
 *   Chrome starts at Pro.
 * - Sign-ins sync: Comet and Dia don't sync sessions; Polar's privacy policy keeps cookies on the
 *   device; ChatGPT's cloud browser keeps its own sign-ins, not yours; Claude works in your Chrome,
 *   which doesn't sync them.
 * - Agents help each other: only Misty lets your agent ask a teammate's agent. OpenAI documents
 *   sharing workspace agents with people, not one person's agent asking another's.
 */
const ROWS: { label: string; cells: Cell[] }[] = [
  { label: "Model for each job", cells: [yes, no, no, no, no, no] },
  { label: "Model makers", cells: ["Any major provider, with your own key", "8", "Picked for you", "Picked for you", "OpenAI only", "Anthropic only"] },
  { label: "Free browser agent", cells: ["Included, you pay only your model provider", "Paid only", "Credits", "No agent", "Limited", "Pro and up"] },
  { label: "Sign-ins sync", cells: ["Yes, some sites ask again", no, no, no, "Cloud browser only", no] },
  { label: "Agents help each other", cells: [yes, no, no, no, no, no] },
  { label: "Phone apps", cells: [no, yes, no, no, "Not checked", "Not checked"] },
  { label: "Built-in ad blocking", cells: ["By extension", yes, "Not stated", yes, "Not checked", "Not checked"] },
  { label: "Chrome Web Store extensions", cells: ["In progress", yes, "Not stated", yes, "Not checked", "Not checked"] },
];

/** Each company's own pages, read October 11, 2026. */
const COMPARE_SOURCES: [string, string][] = [
  ["Comet", "https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you"],
  ["Polar", "https://polarbrowser.com/privacy"],
  ["Dia", "https://www.diabrowser.com/plans"],
  ["ChatGPT", "https://chatgpt.com/pricing"],
  ["ChatGPT browser", "https://learn.chatgpt.com/docs/browser"],
  ["Claude", "https://claude.com/pricing"],
];

function CellValue({ cell }: { cell: Cell }): ReactNode {
  if (typeof cell === "string") return cell;
  return cell.yes
    ? <Check className="mist-compare-mark" aria-label="Yes" />
    : <X className="mist-compare-mark" data-no aria-label="No" />;
}

export function CompareChapter() {
  return (
    <Chapter id="compare" side="end" title={<>Why another AI browser?{" "}<span>Here's how Misty compares.</span></>}>
      <div className="mist-compare" data-reveal>
        {/* Focusable, so keyboard users can scroll the table sideways on narrow screens. */}
        <div className="mist-compare-scroll" tabIndex={0} role="region" aria-label="Misty compared with other AI browsers">
          <table>
            <thead>
              <tr>
                <td />
                {PRODUCTS.map((name, index) => <th key={name} scope="col" data-misty={index === 0 || undefined}>{name}</th>)}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(({ label, cells }) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {cells.map((cell, index) => (
                    <td key={PRODUCTS[index]} data-misty={index === 0 || undefined}><CellValue cell={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mist-fine-print">
          Compared October 11, 2026, from each company's own pages:{" "}
          {COMPARE_SOURCES.map(([name, href], index) => (
            <span key={name}>{index > 0 && ", "}<a href={href} target="_blank" rel="noreferrer">{name}</a></span>
          ))}.
        </p>
      </div>
    </Chapter>
  );
}
