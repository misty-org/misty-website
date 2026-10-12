import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import "./faq.css";

/**
 * Questions and answers as a plain accordion under a "Q&A" heading. Only what the page above
 * doesn't already show: price, platforms, privacy, extensions and sign-ins. Answers follow SELLING-POINTS.md and its fine print, and
 * the pricing answer follows PRICING_MODEL (src/pages/Pricing/data.ts).
 */
const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "Is Misty free?",
    a: <>Yes. Basic is free, never ends and includes every feature. Paid plans add more AI, smarter models, storage and sync. See <Link to="/pricing">pricing</Link>.</>,
  },
  {
    q: "Which computers does Misty run on?",
    a: "Mac and Windows. Misty uses the web engine your computer already has, so the app stays small and gets security fixes from Apple and Microsoft.",
  },
  {
    q: "Can Misty see my data?",
    a: "No. Everything is encrypted on your device before it syncs, with a key only your devices hold. Misty never tracks, shares or reads your data.",
  },
  {
    q: "Do extensions work?",
    a: "On a Mac with macOS 15.4 or later, you can install extensions from the Firefox Add-ons catalog and see what each one can access first. Chrome extensions are in progress, and extensions aren't available on Windows yet.",
  },
  {
    q: "Will I stay signed in on every computer?",
    a: "On most sites, yes. Some sites tie a sign-in to one device and ask you to sign in again, and Misty shows which ones did.",
  },
];

export function HomeFaq() {
  return (
    <section id="faq" className="mist-faq mist-section" aria-labelledby="faq-title" data-mist-scene>
      <div className="mist-container">
        <h2 id="faq-title" aria-label="Questions and answers" data-reveal>Q&amp;A</h2>
        <div className="mist-faq-list" data-reveal-stagger>
          {FAQS.map(({ q, a }) => (
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
