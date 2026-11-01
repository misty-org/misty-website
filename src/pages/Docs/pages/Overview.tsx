import { NavLink } from "react-router";

import { DocSection, DocTable, Paragraphs } from "../components/Prose";
import { DocPage } from "../components/DocPage";
import { docsPages } from "../docsNav";

const WHERE_THINGS_RUN = [
  [
    "The desktop app",
    "Your computer",
    "Browsing, agents and every model call.",
  ],
  [
    "The Misty server",
    "Your own host, or Misty Cloud",
    "Accounts, encrypted sync, Spaces, Library files and the tools agents call.",
  ],
  [
    "Cloudflare",
    "Your Cloudflare account, or Misty Cloud's",
    "HTTPS for the server, file storage in R2, and the Workers that save notes and read pages.",
  ],
  [
    "Composio, Google",
    "Their own services",
    "App actions and Google sign-in.",
  ],
];

/** The docs' front page: the two ways to use Misty, and where to read next. */
export default function Overview() {
  return (
    <DocPage
      title="What Misty is"
      description="Misty is a desktop browser with agents built in. It works on its own, and a Misty server adds sync, Spaces and the tools agents use."
    >
      <DocSection id="two-ways" title="Free or Misty Cloud">
        <Paragraphs
          items={[
            "Misty is free and open source under the GNU AGPL-3.0, with every feature. On Free you set everything up yourself: the server, and your own Cloudflare, Composio and Google accounts. [Run a server](/docs/self-hosting) walks through it.",
            "Misty Cloud is a server that's already configured, for $10 a month plus tax where it applies. You install the app, open the setup link from your welcome email and start. See [pricing](/pricing).",
            "Without a server, Misty is a browser, and everything stays on your computer.",
          ]}
        />
      </DocSection>

      <DocSection id="ai" title="AI runs on your own models">
        <Paragraphs
          items={[
            "Misty hosts no model and never charges for AI, on Free or on Misty Cloud. The models are your own: you sign in with ChatGPT to use your ChatGPT plan, or use OpenRouter, Ollama Cloud, a local Ollama, or your own API keys. [Models](/docs/models) explains what each costs.",
            "Agents run on your desktop. The desktop calls the model you chose, and the server never calls a model or holds a model key. An agent run needs one of your desktops to be online; a run that starts from an email or a schedule waits until one is.",
          ]}
        />
      </DocSection>

      <DocSection id="where-things-run" title="Where things run">
        <DocTable
          columns={["Part", "Where", "What it does"]}
          rows={WHERE_THINGS_RUN}
        />
      </DocSection>

      <DocSection id="pages" title="Every page">
        <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {docsPages.slice(1).map((page) => (
            <li key={page.to} className="bg-background">
              <NavLink
                to={page.to}
                className={`block px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${page.mono ? "font-mono text-[0.8125rem]" : ""}`}
              >
                {page.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  );
}
