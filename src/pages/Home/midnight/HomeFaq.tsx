import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { SiteLink } from "@/components/SiteLink";
import { DISCORD_URL } from "@/lib/site";
import "./faq.css";

type Faq = { q: string; a: ReactNode };
const START: Faq[] = [
  {
    q: "Is Misty free?",
    a: <>Yes. Misty is free and open source under the GNU AGPL-3.0, with every feature included, on Misty Cloud or your own server. Misty+ adds storage for $8 a month, and Boosts raise a space's level for $2 each. AI is never charged for, because it runs on your own models. See <Link to="/pricing">pricing</Link>.</>,
  },
  {
    q: "Do I need an account?",
    a: <>Yes. You sign in to a Misty server, either Misty Cloud or your own, which keeps your Spaces. Your agents still run on your computer. See the <SiteLink to="/docs">docs</SiteLink>.</>,
  },
  {
    q: "Which AI models can I use?",
    a: "Sign in to Claude Code, Codex or Antigravity with the plan you already have, or give Claude Code or Codex an API key through a provider such as OpenRouter. You pick a model for each job.",
  },
  {
    q: "Can my agent edit photos and videos?",
    a: "Yes. Open a photo or a video in a space's Media and ask in its Agent tab: cut the pauses, add captions, cut to the beat of a song, add an animated title, or brighten and crop a batch of photos. Each change shows as it lands and can be undone. Your own agent does the work, so there's no separate AI editing plan to pay for.",
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
    a: "It depends on where the file is. Moving a file between your own computers doesn't: they connect directly, on the same network or through a public tunnel. Files you add to a space's Media are stored on your server, which on Misty Cloud is ours.",
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
