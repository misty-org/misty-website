import { NavLink } from "react-router";

import { DocPage } from "../components/DocPage";
import { BulletList, DocSection, P } from "../components/Prose";
import { docsPages } from "../docsNav";

/** The docs' front page: what Misty is, its key ideas, and where to start. */
export default function Overview() {
  return (
    <DocPage title="What Misty is">
      <P text="Misty is a workspace where people and their AI agents work together." />
      <P text="Bring the AI you already use, such as Claude Code or Codex. Invite your team. Everyone can see what each other's agents are doing as they work." />

      <DocSection id="key-ideas" title="Key ideas">
        <BulletList
          items={[
            "**Agents** do work for you. Each runs on an engine you already use, such as Claude Code or Codex, on your computer and under your own sign-in. See [Choose your engine](/docs/choose-agent).",
            "**Chats** are where you give an agent a task and follow its work. See [Agent chats](/docs/chats).",
            "**Spaces** are shared places for your team. Each space has its own group chat and files, plus the open-source apps it adds. See [Spaces](/docs/spaces).",
            "The **Studio** is a 3D room where you watch your agents work and hire new ones. See [Studio](/docs/studio).",
          ]}
        />
      </DocSection>

      <DocSection id="servers" title="Where your account lives">
        <P text="Spaces and accounts live on a Misty server. You can use ours or run your own." />
        <BulletList
          items={[
            "**Misty Cloud** is our server. It's free, with nothing to set up. See [Plans and Boosts](/docs/plans) for more storage and bigger spaces.",
            "**Your own server** has every feature with no limits. See [Set up a server](/docs/self-hosting).",
          ]}
        />
        <P text="Misty is free and open source under the AGPL-3.0 license. Misty never charges for AI, because your agents run on your own plans." />
      </DocSection>

      <DocSection id="start" title="Start here">
        <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {docsPages.slice(1).map((page) => (
            <li key={page.to} className="bg-background">
              <NavLink
                to={page.to}
                className="block px-4 py-3 text-control text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
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
