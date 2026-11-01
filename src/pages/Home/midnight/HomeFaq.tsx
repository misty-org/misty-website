import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import "./faq.css";

/**
 * Questions and answers as a plain accordion on the right, with a "Q&A" heading centered in the space on the left. Only what the
 * page above doesn't already show: cost, accounts, models, platforms, importing, extensions, privacy, sign-ins, agent
 * approval and files.
 * Answers follow SELLING-POINTS.md and its fine print.
 */
type Faq = { q: string; a: ReactNode };
const START: Faq[] = [
  {
    q: "Is Misty free?",
    a: <>Yes. Misty is free and open source under the GNU AGPL-3.0, with every feature included when you run your own server. Misty Cloud is a server that's already set up, for $10 a month. AI is never charged for, because it runs on your own models. See <Link to="/pricing">pricing</Link>.</>,
  },
  {
    q: "Do I need an account?",
    a: <>No. Misty works as a browser without signing in. Sync and Spaces need a Misty server, either your own or Misty Cloud. See the <Link to="/docs">docs</Link>.</>,
  },
  {
    q: "Which AI models can I use?",
    a: "Sign in with ChatGPT to use your ChatGPT plan, or use OpenRouter, Ollama, or an API key from any major provider, such as OpenAI, Anthropic or Google. You pick a model for each job.",
  },
  {
    q: "Which computers does Misty run on?",
    a: "Mac and Windows. Misty uses the web engine your computer already has, so the app stays small and gets security fixes from Apple and Microsoft.",
  },
  {
    q: "Can I bring my profile from another browser?",
    a: "Yes. You can import your profile and settings from Chrome, Safari, Firefox or Zen.",
  },
  {
    q: "Do extensions work?",
    a: "On a Mac with macOS 15.4 or later, you can install extensions from the Firefox Add-ons catalog and see what each one can access first. Chrome extensions are in progress, and extensions aren't available on Windows yet.",
  },
];
const TRUST: Faq[] = [
  {
    q: "Can Misty read my synced data?",
    a: "No. Everything is encrypted on your device before it syncs, with a key only your devices hold. Misty never tracks, shares or reads your data.",
  },
  {
    q: "Will I stay signed in on every computer?",
    a: "On most sites, yes. Some sites tie a sign-in to one device and ask you to sign in again, and Misty shows which ones did.",
  },
  {
    q: "Can an agent act without asking me?",
    a: "No. An agent shows you its plan first, and nothing changes until you approve it. You can take over at any point.",
  },
  {
    q: "Do my files go through your servers?",
    a: "No. Your computers connect to each other directly, so a file moves between them at local network speed. Both need to be on the same network, or connected through a public tunnel.",
  },
];

export function HomeFaq() {
  return (
    <section id="faq" className="mist-faq mist-section" aria-labelledby="faq-title" data-mist-scene>
      <div className="mist-container mist-faq-layout">
        <div className="mist-faq-head">
          <h2 id="faq-title" aria-label="Questions and answers" data-reveal>Q&amp;A</h2>
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
