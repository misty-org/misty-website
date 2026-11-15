import { NavLink } from "react-router";

import { DocSection, DocTable, P, Paragraphs } from "../components/Prose";
import { DocPage } from "../components/DocPage";
import { docsPages } from "../docsNav";

const WHERE_THINGS_RUN = [
  [
    "The desktop app",
    "Your computer",
    "Chats with your AI, agents, the agent browser and every model call.",
  ],
  [
    "The Misty server",
    "Misty Cloud, or your own host",
    "Accounts, Spaces, group chat, docs and drawings, tasks, the planner and files.",
  ],
  [
    "Cloudflare",
    "Misty Cloud's, or your own Cloudflare account",
    "HTTPS for the server, file storage in R2, and the Worker that saves docs and drawings as people edit them together.",
  ],
  ["Google", "Your Google Cloud project", "Google sign-in."],
];

/** The docs' front page: the two ways to use Misty, and where to read next. */
export default function Overview() {
  return (
    <DocPage title="What Misty is">
      <P text="Misty is one shared workspace where people and agents work together. Pick any AI you like, invite your people, and see what everyone's agents are doing as it happens. It works on one computer on its own, and a Misty server adds accounts and Spaces." />

      <DocSection id="two-ways" title="Free, Misty+ and Boosts">
        <Paragraphs
          items={[
            "Misty is free and open source under the GNU AGPL-3.0, with every feature. On Free you can use Misty Cloud, our server, with nothing to set up: make a Misty account here, then choose Misty Cloud in the app and sign in.",
            "Or run your own server, with your own Cloudflare and Google accounts. [Run a server](/docs/self-hosting) walks through it.",
            "Free on Misty Cloud has 5 GB of storage, and you can make and join as many Spaces as you like. Misty+ ($8 a month or $72 a year) has 100 GB and comes with 3 Boosts. A Boost ($2 a month) raises a Space's level for everyone in it: more people, more agents and its own storage. Prices are plus tax where it applies; see [pricing](/pricing).",
            "A server you run yourself has no levels or Boosts: every Space there is unlimited.",
            "Without a server, Misty runs on this computer only, with no Spaces to share.",
          ]}
        />
      </DocSection>

      <DocSection id="ai" title="AI runs on your own models">
        <Paragraphs
          items={[
            "Chat with the AI you already use, such as Claude Code, Codex or OpenCode, under your own sign-in.",
            "Misty hosts no model and never charges for AI, on any plan. The models are your own: you sign in with ChatGPT to use your ChatGPT plan, or use OpenRouter, Ollama Cloud, a local Ollama, or your own API keys. [Models](/docs/models) explains what each costs.",
            "Agents run on your desktop. The desktop calls the model you chose, and the server never calls a model or holds a model key. An agent run needs one of your desktops to be online; a run that starts from a mention in Space chat or a schedule waits until one is.",
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
                className={`block px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring`}
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
