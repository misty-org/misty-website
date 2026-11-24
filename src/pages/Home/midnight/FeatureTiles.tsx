import { AppWindow, Armchair, Bot, Code, FlaskConical, Folder, Hand, History, Layers, MessagesSquare, Package, Plug, Presentation, Puzzle, Users } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Mark } from "@misty/ui";
import { Chapter } from "./Chapter";
import {
  AgentsApps, AgentsPlugins, AgentsSkills, ChatsHistory, ChatsNeedsYou, ChatsRunning, SpaceAppSession, SpaceApps,
  SpaceChat, SpaceFiles, SpaceLab, Studio, StudioRoom, StudioTeam, StudioYours,
} from "./ShotSketches";
import { BentoTiles, type Feature } from "./Tiles";

function Row({ icon, name, note, index }: { icon: ReactNode; name: string; note: ReactNode; index: number }) {
  return <div style={{ "--row": index } as CSSProperties}>{icon}<b>{name}</b><small>{note}</small></div>;
}

type ChatState = "working" | "waiting" | "done";
const CHATS: readonly { title: string; engine: string; state: ChatState }[] = [
  { title: "Launch catch-up", engine: "claude", state: "working" },
  { title: "Fix the signup form", engine: "codex", state: "waiting" },
  { title: "Weekly metrics", engine: "claude", state: "working" },
  { title: "Plan the offsite", engine: "agy", state: "done" },
];
const STATE_NOTE: Record<ChatState, string> = { working: "Working", waiting: "Needs you", done: "Done" };

function Chats() {
  return (
    <div className="mist-tile-sheet" aria-hidden="true">
      {CHATS.map((chat, index) => (
        <Row key={chat.title} index={index} icon={<Mark of={`engine:${chat.engine}`} size={16} />} name={chat.title}
          note={<><i className="mist-tile-dot" data-state={chat.state} />{STATE_NOTE[chat.state]}</>} />
      ))}
    </div>
  );
}

function Space() {
  return (
    <div className="mist-tile-sheet" aria-hidden="true">
      <Row index={0} icon={<MessagesSquare size={16} />} name="Chat" note="Group and direct" />
      <Row index={1} icon={<Folder size={16} />} name="Files" note="On your computer too" />
      <Row index={2} icon={<FlaskConical size={16} />} name="Lab" note="Notebooks" />
      <Row index={3} icon={<Code size={16} />} name="Code" note="Projects" />
      <Row index={4} icon={<AppWindow size={16} />} name="Apps" note="Open source, from GitHub" />
    </div>
  );
}

function AgentsPage() {
  return (
    <div className="mist-tile-sheet" aria-hidden="true">
      <Row index={0} icon={<Mark of="gmail" size={16} />} name="Gmail" note="Signed in" />
      <Row index={1} icon={<Mark of="google-docs" size={16} />} name="Google Docs" note="Signed in" />
      <Row index={2} icon={<Mark of="slack" size={16} />} name="Slack" note="Signed in" />
      <Row index={3} icon={<Puzzle size={16} />} name="Release notes" note="Skill" />
    </div>
  );
}

const shot = (file: string, alt: string, name: string, icon: ReactNode, sketch: ReactNode) =>
  ({ src: `/screenshots/home/${file}`, alt, name, icon, sketch });

const FEATURES: readonly Feature[] = [
  {
    span: 7, sketch: <Chats />,
    title: "Agent chats. Run several at once on Claude Code, Codex or Antigravity, see which need you, and pick up past chats anytime.",
    shots: [
      shot("chats-running.webp", "Several agent chats working at once", "Several at once", <Layers size={14} />, <ChatsRunning />),
      shot("chats-needs-you.webp", "An agent chat waiting on your answer", "Needs you", <Hand size={14} />, <ChatsNeedsYou />),
      shot("chats-history.webp", "Past chats, ready to pick up", "Past chats", <History size={14} />, <ChatsHistory />),
    ],
  },
  {
    span: 5, sketch: <Space />,
    title: "Spaces. A group chat, shared files, notebooks and code, plus any open-source app you add, for everyone you invite and their agents.",
    shots: [
      shot("space-chat.webp", "A Space's group chat", "Chat", <MessagesSquare size={14} />, <SpaceChat />),
      shot("space-files.webp", "A Space's shared files", "Files", <Folder size={14} />, <SpaceFiles />),
      shot("space-apps.webp", "Open-source apps added to a Space from GitHub", "Apps", <AppWindow size={14} />, <SpaceApps />),
      shot("space-app-session.webp", "An agent working in DeckCraft beside its person", "In an app", <Presentation size={14} />, <SpaceAppSession />),
      shot("space-lab.webp", "A notebook in a space's Lab", "Lab", <FlaskConical size={14} />, <SpaceLab />),
    ],
  },
  {
    span: 5, sketch: <Studio />,
    title: "The Studio. A 3D room where you see your agents, and your teammates', at work.",
    shots: [
      shot("studio-room.webp", "The Studio's room with every desk", "The room", <Armchair size={14} />, <StudioRoom />),
      shot("studio-yours.webp", "Your agents at their desks in the Studio", "Your agents", <Bot size={14} />, <StudioYours />),
      shot("studio-team.webp", "Your teammates' agents at work in the Studio", "Teammates", <Users size={14} />, <StudioTeam />),
    ],
  },
  {
    span: 7, sketch: <AgentsPage />,
    title: "The Agents page. The apps your agents sign in to and the skills they learn, in one place.",
    shots: [
      shot("agents-apps.webp", "Apps your agents are signed in to", "Apps", <Plug size={14} />, <AgentsApps />),
      shot("agents-skills.webp", "Skills your agents have learned", "Skills", <Puzzle size={14} />, <AgentsSkills />),
      shot("agents-plugins.webp", "Plugins that add apps and skills for your agents", "Plugins", <Package size={14} />, <AgentsPlugins />),
    ],
  },
];

export function FeaturesChapter() {
  return (
    <Chapter id="highlights" title={<>One app for your agents{" "}<span>and the people you work with.</span></>}>
      <BentoTiles features={FEATURES} />
    </Chapter>
  );
}
