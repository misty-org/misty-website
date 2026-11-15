import { Armchair, Bot, FlaskConical, FolderOpen, Hand, History, Layers, ListTodo, MessagesSquare, NotebookPen, Package, Plug, Puzzle, Users } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import gmail from "@/assets/brand-icons/gmail.svg";
import googleDocs from "@/assets/brand-icons/google-docs.svg";
import slack from "@/assets/brand-icons/slack.svg";
import { Chapter } from "./Chapter";
import { EngineMark } from "./EngineMark";
import {
  AgentsApps, AgentsPlugins, AgentsSkills, ChatsHistory, ChatsNeedsYou, ChatsRunning, SpaceChat, SpaceJournal,
  SpaceLab, SpaceLibrary, SpacePlanner, Studio, StudioRoom, StudioTeam, StudioYours,
} from "./ShotSketches";
import { BentoTiles, type Feature } from "./Tiles";

/**
 * Misty's four places as one bento grid: agent chats, Spaces (with the Lab inside them), the Studio,
 * and the Agents page (with the apps agents sign in to). Fewer tiles, so it's clear what Misty is.
 * The engines are their own row under the hero (EngineCarousel). Claims follow the app's README.
 */

/** One row of a sheet: its own icon, a name, and a note on the right. `index` staggers its entrance (tiles.css). */
function Row({ icon, name, note, index }: { icon: ReactNode; name: string; note: ReactNode; index: number }) {
  return <div style={{ "--row": index } as CSSProperties}>{icon}<b>{name}</b><small>{note}</small></div>;
}

/** The app's run states, each in its tone: working, waiting on you, done. */
type ChatState = "working" | "waiting" | "done";
const CHATS: readonly { title: string; engine: string; state: ChatState }[] = [
  { title: "Launch catch-up", engine: "claude", state: "working" },
  { title: "Fix the signup form", engine: "codex", state: "waiting" },
  { title: "Weekly metrics", engine: "opencode", state: "working" },
  { title: "Plan the offsite", engine: "agy", state: "done" },
];
const STATE_NOTE: Record<ChatState, string> = { working: "Working", waiting: "Needs you", done: "Done" };

function Chats() {
  return (
    <div className="mist-tile-sheet" aria-hidden="true">
      {CHATS.map((chat, index) => (
        <Row key={chat.title} index={index} icon={<EngineMark engine={chat.engine} size={16} />} name={chat.title}
          note={<><i className="mist-tile-dot" data-state={chat.state} />{STATE_NOTE[chat.state]}</>} />
      ))}
    </div>
  );
}

/** What a Space holds, each part with its own icon; the Lab's notebooks live here now. */
function Space() {
  return (
    <div className="mist-tile-sheet" aria-hidden="true">
      <Row index={0} icon={<MessagesSquare size={16} />} name="Chat" note="Group and direct" />
      <Row index={1} icon={<NotebookPen size={16} />} name="Journal" note="Docs and drawings" />
      <Row index={2} icon={<ListTodo size={16} />} name="Planner" note="Tasks and dates" />
      <Row index={3} icon={<FolderOpen size={16} />} name="Library" note="Shared files" />
      <Row index={4} icon={<FlaskConical size={16} />} name="Lab" note="Notebooks" />
    </div>
  );
}

/** The Agents page: the apps agents sign in to, and the skills they've learned. */
function AgentsPage() {
  return (
    <div className="mist-tile-sheet" aria-hidden="true">
      <Row index={0} icon={<img src={gmail} alt="" width={16} height={16} />} name="Gmail" note="Signed in" />
      <Row index={1} icon={<img src={googleDocs} alt="" width={16} height={16} />} name="Google Docs" note="Signed in" />
      <Row index={2} icon={<img src={slack} alt="" width={16} height={16} />} name="Slack" note="Signed in" />
      <Row index={3} icon={<Puzzle size={16} />} name="Release notes" note="Skill" />
    </div>
  );
}

/**
 * Each tile's screenshots, in the order the scroll moves through them once the tile has zoomed open (see
 * BentoTiles). Drop the captures into public/screenshots/home/ under these names; until a file exists, its place
 * shows its drawn stand-in (ShotSketches).
 */
const shot = (file: string, alt: string, name: string, icon: ReactNode, sketch: ReactNode) =>
  ({ src: `/screenshots/home/${file}`, alt, name, icon, sketch });

const FEATURES: readonly Feature[] = [
  {
    span: 7, sketch: <Chats />,
    title: "Agent chats. Run several at once with any agent, see which need you, and pick up past chats anytime.",
    shots: [
      shot("chats-running.webp", "Several agent chats working at once", "Several at once", <Layers size={14} />, <ChatsRunning />),
      shot("chats-needs-you.webp", "An agent chat waiting on your answer", "Needs you", <Hand size={14} />, <ChatsNeedsYou />),
      shot("chats-history.webp", "Past chats, ready to pick up", "Past chats", <History size={14} />, <ChatsHistory />),
    ],
  },
  {
    span: 5, sketch: <Space />,
    title: "Spaces. A group chat, docs and drawings, tasks, files and notebooks, shared with everyone you invite.",
    shots: [
      shot("space-chat.webp", "A Space's group chat", "Chat", <MessagesSquare size={14} />, <SpaceChat />),
      shot("space-journal.webp", "A Space's Journal with docs and drawings", "Journal", <NotebookPen size={14} />, <SpaceJournal />),
      shot("space-planner.webp", "A Space's Planner with tasks and dates", "Planner", <ListTodo size={14} />, <SpacePlanner />),
      shot("space-library.webp", "A Space's Library of shared files", "Library", <FolderOpen size={14} />, <SpaceLibrary />),
      shot("space-lab.webp", "A notebook in a Space's Lab", "Lab", <FlaskConical size={14} />, <SpaceLab />),
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
