import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { SiteLink } from "@/components/SiteLink";
import { DISCORD_URL } from "@/lib/site";
import "./faq.css";

/**
 * Questions and answers as a plain accordion on the right, under a heading at the top of the left column with where to ask the rest. Only what the
 * page above doesn't already show: cost, accounts, models, platforms, privacy, agent approval and files.
 */
type Faq = { q: string; a: ReactNode };
const START: Faq[] = [
  {
    q: "Is Misty free?",
    a: <>Yes. Misty is free and open source under the GNU AGPL-3.0, with every feature included, on Misty Cloud or your own server. Misty+ adds storage for $8 a month, and Boosts raise a space's level for $2 each. AI is never charged for, because it runs on your own models. See <Link to="/pricing">pricing</Link>.</>,
  },
  {
    q: "Do I need an account?",
    a: <>No. Misty works on one computer without a server. Spaces and teammates need a Misty server, either Misty Cloud or your own. See the <SiteLink to="/docs">docs</SiteLink>.</>,
  },
  {
    q: "Which AI models can I use?",
    a: "Sign in with ChatGPT to use your ChatGPT plan, or use OpenRouter, Ollama, or an API key from any major provider, such as OpenAI, Anthropic or Google. You pick a model for each job.",
  },
  {
    q: "Which computers does Misty run on?",
    a: "Mac and Windows. Misty uses the web engine your computer already has, so the app stays small and gets security fixes from Apple and Microsoft.",
  },
];
const TRUST: Faq[] = [
  {
    q: "Can Misty read my data?",
    a: "Agents, their model calls and their chats stay on your computer. A Misty server stores your spaces, with their messages and files, and your account details, and whoever runs it can read them. On Misty Cloud, that's us. There are no ads, analytics or data sales.",
  },
  {
    q: "Can an agent act without asking me?",
    a: "It depends on the chat's mode. Manual pauses before every change. Auto continues with work inside what you gave the chat and any approvals you chose to remember, and asks you about the rest. Payments ask first, even in Auto, unless you turn that off. You can watch an agent work and take over at any point.",
  },
  {
    q: "Do my files go through your servers?",
    a: "It depends on where the file is. Moving a file between your own computers doesn't: they connect directly, on the same network or through a public tunnel. Files you add to a space or your Library are stored on your server, which on Misty Cloud is ours.",
  },
];

export function HomeFaq() {
  return (
    <section id="faq" className="mist-faq mist-section" aria-labelledby="faq-title" data-mist-scene>
      <div className="mist-container mist-faq-layout">
        <div className="mist-faq-head">
          <h2 id="faq-title" data-reveal>Questions</h2>
          <p data-reveal>Something else? Ask on <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Discord</a>.</p>
        </div>
        <div className="mist-faq-list" data-reveal-stagger>
          {[...START, ...TRUST].map(({ q, a }) => (
            <details key={q} className="mist-faq-item">
              <summary>{q}<ChevronDown size={16} strokeWidth={1.75} aria-hidden /></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
