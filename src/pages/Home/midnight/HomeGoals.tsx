import {
  Bot, ChefHat, Cloud, Code, Compass, CreditCard, Cpu, FlaskConical, FolderOpen, Gamepad2, GraduationCap, HardDrive,
  KeyRound, Laptop, ListTodo, MessagesSquare, Music, NotebookPen, Percent, Server, Unlock,
} from "lucide-react";
import type { ReactNode } from "react";
import { Bar, Person } from "./ShotSketches";
import "./shots.css";
import "./goals.css";

/**
 * Why Misty exists, after what you can do together: a short statement, then each goal as its own wide row, alternating
 * sides, with a large panel that shows the goal happening. The panels are drawn like the bento's screenshots
 * (ShotSketches), and every row in them wears its own subject's icon. No brand names here. Claims follow the
 * app's README; the spaces people explore are where Misty is headed.
 */

/** Someone in a space's thread: a person, or a person's agent. */
function Message({ from, agent = false, children }: { from: string; agent?: boolean; children: ReactNode }) {
  return (
    <div className="mist-mock-message">
      {agent ? <Bot size={16} /> : <Person name={from} />}
      <p><b>{from}</b>{children}</p>
    </div>
  );
}

/** A Space where people learning AI help each other, with an agent showing how. */
function LearnPanel() {
  return (
    <div className="mist-mock">
      <Bar icon={<Person name="Learning AI" />} title="Learning AI" note="214 members" />
      <div className="mist-mock-thread">
        <Message from="Maya">How do I get an agent to sum up a long PDF?</Message>
        <Message from="Jordan">Drop it in the Library, then ask in chat. Here's the prompt I use.</Message>
        <Message from="Jordan's agent" agent>Summed up all 38 pages. The five key points are in the Journal.</Message>
        <Message from="Maya">Oh, that's easy. Trying it on my notes now.</Message>
      </div>
    </div>
  );
}

const MADE: readonly { icon: ReactNode; name: string; about: string; members: string }[] = [
  { icon: <Gamepad2 size={16} />, name: "Pixel Pets", about: "A tiny pet game three friends built with their agents.", members: "1.2k members" },
  { icon: <ChefHat size={16} />, name: "Pantry Chef", about: "Recipes from whatever is left in your fridge.", members: "860 members" },
  { icon: <Music size={16} />, name: "Lo-fi Lab", about: "Beats and loops, made and remixed together.", members: "540 members" },
  { icon: <GraduationCap size={16} />, name: "Study Circle", about: "Flashcards and quizzes for any class.", members: "2.4k members" },
];

/** Spaces full of things people made with AI, to look through. */
function ExplorePanel() {
  return (
    <div className="mist-mock">
      <Bar icon={<Compass size={16} />} title="Explore spaces" note="New this week" />
      <div className="mist-mock-cards" data-columns="2">
        {MADE.map(space => (
          <article key={space.name} className="mist-mock-card">
            <div className="mist-mock-line">{space.icon}<b>{space.name}</b></div>
            <p>{space.about}</p>
            <small>{space.members}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

/** A team's space and the light tools built into it, each busy with the team's work. */
function TeamPanel() {
  return (
    <div className="mist-mock">
      <Bar icon={<Person name="Product" />} title="Product" note="6 people and 3 agents" />
      <div className="mist-mock-groups">
        <div className="mist-mock-row"><MessagesSquare size={16} /><b>Chat</b><small>3 new messages</small></div>
        <div className="mist-mock-row"><NotebookPen size={16} /><b>Journal</b><small>Launch plan, edited by Sam</small></div>
        <div className="mist-mock-row"><ListTodo size={16} /><b>Planner</b><small>4 tasks due this week</small></div>
        <div className="mist-mock-row"><FolderOpen size={16} /><b>Library</b><small>12 shared files</small></div>
        <div className="mist-mock-row"><FlaskConical size={16} /><b>Lab</b><small>Signup chart updated</small></div>
      </div>
    </div>
  );
}

/** Where your agents' models come from: what you already pay for, and nothing on top. */
function ModelsPanel() {
  return (
    <div className="mist-mock">
      <Bar icon={<Cpu size={16} />} title="Models" note="3 agents" />
      <div className="mist-mock-groups">
        <div className="mist-mock-row"><CreditCard size={16} /><b>Your plan</b><small>Signed in</small></div>
        <div className="mist-mock-row"><KeyRound size={16} /><b>API key</b><small>Connected</small></div>
        <div className="mist-mock-row"><HardDrive size={16} /><b>Local model</b><small>On this computer</small></div>
        <div className="mist-mock-row"><Percent size={16} /><b>Markup</b><small>None</small></div>
      </div>
    </div>
  );
}

/** Every way to run Misty, and what it costs to have it all. */
function RunPanel() {
  return (
    <div className="mist-mock">
      <Bar icon={<Code size={16} />} title="Misty" note="Open source" />
      <div className="mist-mock-groups">
        <div className="mist-mock-row"><Cloud size={16} /><b>Our cloud</b><small>Hosted for you</small></div>
        <div className="mist-mock-row"><Server size={16} /><b>Your server</b><small>Self-hosted</small></div>
        <div className="mist-mock-row"><Laptop size={16} /><b>This computer</b><small>No server needed</small></div>
        <div className="mist-mock-row"><Unlock size={16} /><b>Every feature</b><small>Free</small></div>
      </div>
    </div>
  );
}

type Goal = { title: string; body: string; panel: ReactNode };
const GOALS: readonly Goal[] = [
  {
    title: "Anyone can use AI",
    body: "Misty takes care of the technical parts, from installing an agent to signing in to it, with no terminal to type into. And you don't learn alone: spaces are where people new to AI ask questions, share what works and learn from each other.",
    panel: <LearnPanel />,
  },
  {
    title: "Make things, and see what others make",
    body: "Whatever you build with your agents lives in your space, where others can see it and try it. Every space holds something different people made with AI, so there's always something new to explore.",
    panel: <ExplorePanel />,
  },
  {
    title: "Teamwork without the setup",
    body: "Every space comes with the basics a team needs: a group chat, docs and drawings, tasks, files and notebooks. They're light and built in, so your team starts working together in minutes instead of wiring tools together.",
    panel: <TeamPanel />,
  },
  {
    title: "Any agent, on your own models",
    body: "Use the agents you already like, side by side, with nothing tying you to one. They run on the plans, API keys or local models you already have, and we never resell AI or add a markup.",
    panel: <ModelsPanel />,
  },
  {
    title: "Yours to run",
    body: "Misty is open source, with every feature free. Use our cloud, host your own server, or keep everything on your own computer.",
    panel: <RunPanel />,
  },
];

export function HomeGoals() {
  return (
    <section id="goals" className="mist-goals mist-section" aria-labelledby="goals-title" data-mist-scene>
      <div className="mist-container">
        <header className="mist-goals-head">
          <h2 id="goals-title" data-reveal>Why we're building Misty</h2>
          <p data-reveal>
            AI is changing how people learn, make things and work, but most AI tools still leave one person alone in a
            chat. We're building a place where people and their agents do all three together.
          </p>
        </header>
        <div className="mist-goals-rows">
          {GOALS.map(({ title, body, panel }, index) => (
            <article key={title} className="mist-goal" data-flip={index % 2 === 1 || undefined} data-reveal>
              <div className="mist-goal-text">
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
              <div className="mist-goal-panel" aria-hidden="true">{panel}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
