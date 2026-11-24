import {
  AppWindow, Armchair, AudioLines, Bot, ChartLine, FileImage, FileSpreadsheet, FileText, FileVideo, FlaskConical, Folder,
  Hand, History, Image, Inbox, Languages, Layers, Package, Palette, Plug, Plus, Presentation, Puzzle, ScrollText,
  SendHorizontal, Users,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Mark } from "@misty/ui";
import "./shots.css";

type State = "working" | "waiting" | "done";
const STATE_NOTE: Record<State, string> = { working: "Working", waiting: "Needs you", done: "Done" };
const Dot = ({ state }: { state: State }) => <i className="mist-tile-dot" data-state={state} />;
const Brand = ({ of }: { of: string }) => <Mark of={of} size={18} />;
export const Person = ({ name }: { name: string }) => <span className="mist-mock-person">{name[0]}</span>;

export function Bar({ icon, title, note }: { icon: ReactNode; title: string; note?: ReactNode }) {
  return <header className="mist-mock-bar">{icon}<b>{title}</b>{note && <small>{note}</small>}</header>;
}

const RUNNING: readonly { engine: string; title: string; state: State; last: string }[] = [
  { engine: "claude", title: "Launch catch-up", state: "working", last: "Reading 42 messages in #launch to sum up what changed since Friday." },
  { engine: "codex", title: "Fix the signup form", state: "waiting", last: "Found the bug. Want me to push the fix to staging?" },
  { engine: "claude", title: "Weekly metrics", state: "working", last: "Pulling signups and retention from the dashboard." },
  { engine: "agy", title: "Plan the offsite", state: "done", last: "Three venues shortlisted and the agenda saved to Files." },
];

export function ChatsRunning() {
  return (
    <div className="mist-mock">
      <Bar icon={<Layers size={16} />} title="Running now" note="4 chats" />
      <div className="mist-mock-cards" data-columns="2">
        {RUNNING.map(chat => (
          <article key={chat.title} className="mist-mock-card">
            <div className="mist-mock-line"><Mark of={`engine:${chat.engine}`} size={16} /><b>{chat.title}</b>
              <small><Dot state={chat.state} />{STATE_NOTE[chat.state]}</small></div>
            <p>{chat.last}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ChatsNeedsYou() {
  return (
    <div className="mist-mock">
      <Bar icon={<Mark of="engine:codex" size={16} />} title="Fix the signup form" note={<><Dot state="waiting" />Needs you</>} />
      <div className="mist-mock-thread">
        <div className="mist-mock-message" data-from="you">The signup form rejects emails with a plus sign. Can you fix it?</div>
        <div className="mist-mock-message">
          <Mark of="engine:codex" size={16} />
          <p>Found it: the email check drops “+”. I patched the pattern and added three tests, and all of them pass.</p>
        </div>
        <div className="mist-mock-ask">
          <div className="mist-mock-line"><Hand size={16} /><b>Push the fix to staging?</b></div>
          <div className="mist-mock-actions"><span>Not yet</span><span data-primary>Push it</span></div>
        </div>
      </div>
    </div>
  );
}

const HISTORY: readonly { when: string; chats: readonly { engine: string; title: string; at: string }[] }[] = [
  { when: "Today", chats: [{ engine: "claude", title: "Launch catch-up", at: "9:40" }, { engine: "claude", title: "Weekly metrics", at: "8:15" }] },
  { when: "Yesterday", chats: [{ engine: "codex", title: "Fix the signup form", at: "17:02" }, { engine: "codex", title: "Draft the changelog", at: "11:30" }] },
  { when: "Last week", chats: [{ engine: "agy", title: "Plan the offsite", at: "Thu" }, { engine: "claude", title: "Research venues", at: "Tue" }] },
];

export function ChatsHistory() {
  return (
    <div className="mist-mock">
      <Bar icon={<History size={16} />} title="Past chats" note="Pick up anytime" />
      <div className="mist-mock-groups">
        {HISTORY.map(group => (
          <section key={group.when}>
            <h4>{group.when}</h4>
            {group.chats.map(chat => (
              <div key={chat.title} className="mist-mock-row"><Mark of={`engine:${chat.engine}`} size={16} /><b>{chat.title}</b><small>{chat.at}</small></div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

export function SpaceChat() {
  return (
    <div className="mist-mock">
      <Bar icon={<Person name="Launch" />} title="Launch" note="Priya, Sam, Alex and 2 agents" />
      <div className="mist-mock-thread">
        <div className="mist-mock-message"><Person name="Priya" /><p><b>Priya</b>Can someone pull last week's signups for the review?</p></div>
        <div className="mist-mock-message"><Mark of="engine:claude" size={16} /><p><b>Alex's agent</b>Here they are: 1,284 signups, up 12% on the week before. The chart is in the Lab.</p></div>
        <div className="mist-mock-message"><Person name="Sam" /><p><b>Sam</b>Nice, I'll add it to the launch deck.</p></div>
      </div>
      <div className="mist-mock-composer">Message Launch<SendHorizontal size={16} /></div>
    </div>
  );
}

export function SpaceAppSession() {
  return (
    <div className="mist-mock">
      <Bar icon={<Presentation size={16} />} title="Launch deck" note="Sam and his agent" />
      <div className="mist-mock-split">
        <div className="mist-mock-doc">
          <h4>Why now</h4>
          <p>Signups are up 12% on last week, and most new teams bring an agent on day one.</p>
          <p>Sam's agent is laying out the chart from the Lab on the next slide.</p>
        </div>
        <svg className="mist-mock-drawing" viewBox="0 0 260 180" role="presentation">
          <rect x="10" y="20" width="90" height="44" rx="10" /><text x="55" y="47">Problem</text>
          <rect x="160" y="20" width="90" height="44" rx="10" /><text x="205" y="47">Why now</text>
          <rect x="85" y="116" width="90" height="44" rx="10" /><text x="130" y="143">Launch</text>
          <path d="M100 42 H160 M205 64 Q205 138 175 138" />
        </svg>
      </div>
    </div>
  );
}

const APPS: readonly { icon: ReactNode; name: string; note: string }[] = [
  { icon: <Presentation size={16} />, name: "DeckCraft", note: "Sam and his agent are in the launch deck." },
  { icon: <Image size={16} />, name: "PhotoCraft", note: "Priya is editing the venue photos." },
  { icon: <AudioLines size={16} />, name: "SoundCraft", note: "Alex's agent is cutting the demo voiceover." },
];

export function SpaceApps() {
  return (
    <div className="mist-mock">
      <Bar icon={<AppWindow size={16} />} title="Apps" note="3 in this space" />
      <div className="mist-mock-cards" data-columns="2">
        {APPS.map(app => (
          <article key={app.name} className="mist-mock-card">
            <div className="mist-mock-line">{app.icon}<b>{app.name}</b><small><Dot state="working" />Live</small></div>
            <p>{app.note}</p>
          </article>
        ))}
        <article className="mist-mock-card" data-add>
          <div className="mist-mock-line"><Plus size={16} /><b>Add from GitHub</b></div>
          <p>Paste an open-source app's link.</p>
        </article>
      </div>
    </div>
  );
}

const FILES: readonly { icon: ReactNode; name: string; note: string; who: string }[] = [
  { icon: <FileText size={16} />, name: "Offsite agenda.md", note: "4 KB", who: "Sam" },
  { icon: <FileSpreadsheet size={16} />, name: "Signups by week.csv", note: "18 KB", who: "Alex's agent" },
  { icon: <FileImage size={16} />, name: "Venue shortlist.png", note: "1.2 MB", who: "Priya" },
  { icon: <FileVideo size={16} />, name: "Launch demo.mp4", note: "24 MB", who: "Sam" },
];

export function SpaceFiles() {
  return (
    <div className="mist-mock">
      <Bar icon={<Folder size={16} />} title="Files" note="Shared with 5 people" />
      <div className="mist-mock-groups">
        {FILES.map(file => (
          <div key={file.name} className="mist-mock-row">{file.icon}<b>{file.name}</b><small>{file.note} from {file.who}</small></div>
        ))}
      </div>
    </div>
  );
}

const WEEKS = [42, 55, 48, 63, 70, 66, 81, 92];

export function SpaceLab() {
  return (
    <div className="mist-mock">
      <Bar icon={<FlaskConical size={16} />} title="Signups.ipynb" note="Python" />
      <div className="mist-mock-notebook">
        <code><small>[1]</small>signups = load("signups by week.csv")</code>
        <code><small>[2]</small>signups.weekly().plot(title="Weekly signups")</code>
        <figure className="mist-mock-chart">
          {WEEKS.map((week, index) => <i key={index} style={{ "--h": `${week}%` } as CSSProperties} />)}
          <figcaption>Weekly signups</figcaption>
        </figure>
      </div>
    </div>
  );
}

export type Desk = { engine: string; who: string } | null;
const DESKS: readonly Desk[] = [
  { engine: "claude", who: "Alex" }, null, { engine: "agy", who: "You" },
  null, { engine: "codex", who: "Sam" }, null,
  { engine: "claude", who: "Priya" }, null, { engine: "codex", who: "You" },
];

export function Studio({ desks = DESKS }: { desks?: readonly Desk[] }) {
  return (
    <div className="mist-studio" aria-hidden="true">
      <div className="mist-studio-floor">
        {desks.map((desk, index) => (
          <div key={index} className="mist-studio-desk" style={{ "--row": index } as CSSProperties}>
            {desk && <span className="mist-studio-agent"><Mark of={`engine:${desk.engine}`} size={14} />{desk.who}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Room({ icon, title, note, desks }: { icon: ReactNode; title: string; note: string; desks: readonly Desk[] }) {
  return (
    <div className="mist-mock">
      <Bar icon={icon} title={title} note={note} />
      <div className="mist-mock-room"><Studio desks={desks} /></div>
    </div>
  );
}

export const StudioRoom = () => <Room icon={<Armchair size={16} />} title="The Studio" note="5 agents at work" desks={DESKS} />;
export const StudioYours = () => (
  <Room icon={<Bot size={16} />} title="Your agents" note="3 at their desks" desks={[
    null, { engine: "agy", who: "Offsite" }, null,
    { engine: "codex", who: "Changelog" }, null, { engine: "claude", who: "Research" },
    null, null, null,
  ]} />
);
export const StudioTeam = () => (
  <Room icon={<Users size={16} />} title="Teammates" note="Alex, Sam and Priya" desks={[
    { engine: "claude", who: "Alex" }, null, { engine: "codex", who: "Sam" },
    null, { engine: "claude", who: "Priya" }, null,
    { engine: "codex", who: "Alex" }, null, { engine: "claude", who: "Priya" },
  ]} />
);

export function AgentsApps() {
  return (
    <div className="mist-mock">
      <Bar icon={<Plug size={16} />} title="Apps" note="3 signed in" />
      <div className="mist-mock-cards" data-columns="2">
        {[{ mark: "gmail", name: "Gmail" }, { mark: "google-docs", name: "Google Docs" }, { mark: "slack", name: "Slack" }].map(app => (
          <article key={app.name} className="mist-mock-card">
            <div className="mist-mock-line"><Brand of={app.mark} /><b>{app.name}</b><small><Dot state="done" />Signed in</small></div>
            <p>Your agents use it as you, with your sign-in.</p>
          </article>
        ))}
        <article className="mist-mock-card" data-add>
          <div className="mist-mock-line"><Plus size={16} /><b>Add an app</b></div>
          <p>Sign in once and every agent can use it.</p>
        </article>
      </div>
    </div>
  );
}

const SKILLS: readonly { icon: ReactNode; name: string; does: string; used: string }[] = [
  { icon: <ScrollText size={16} />, name: "Release notes", does: "Turns merged changes into notes in your voice", used: "Used 12 times" },
  { icon: <ChartLine size={16} />, name: "Weekly metrics", does: "Pulls the numbers and writes the summary", used: "Used 8 times" },
  { icon: <Inbox size={16} />, name: "Triage inbox", does: "Sorts new mail and drafts the easy replies", used: "Used 21 times" },
  { icon: <Languages size={16} />, name: "Translate docs", does: "Keeps the Spanish and German docs in step", used: "Used 3 times" },
];

export function AgentsSkills() {
  return (
    <div className="mist-mock">
      <Bar icon={<Puzzle size={16} />} title="Skills" note="4 learned" />
      <div className="mist-mock-groups">
        {SKILLS.map(skill => (
          <div key={skill.name} className="mist-mock-row">{skill.icon}<b>{skill.name}</b><span>{skill.does}</span><small>{skill.used}</small></div>
        ))}
      </div>
    </div>
  );
}

const PLUGINS: readonly { icon: ReactNode; name: string; adds: string }[] = [
  { icon: <Brand of="google-docs" />, name: "Google Workspace", adds: "Adds Gmail, Docs and Calendar, and 2 skills" },
  { icon: <Brand of="slack" />, name: "Slack", adds: "Adds Slack, and a skill for catch-ups" },
  { icon: <Palette size={18} />, name: "Design kit", adds: "Adds 3 skills for reviews and handoff" },
];

export function AgentsPlugins() {
  return (
    <div className="mist-mock">
      <Bar icon={<Package size={16} />} title="Plugins" note="3 installed" />
      <div className="mist-mock-cards" data-columns="3">
        {PLUGINS.map(plugin => (
          <article key={plugin.name} className="mist-mock-card">
            <div className="mist-mock-line">{plugin.icon}<b>{plugin.name}</b></div>
            <p>{plugin.adds}</p>
            <small><Dot state="done" />Installed</small>
          </article>
        ))}
      </div>
    </div>
  );
}
