import { FileText, FlaskConical, GitPullRequest, Newspaper } from "lucide-react";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Chapter } from "./Chapter";
import { usePinnedSteps } from "./use_pinned_steps";
import "./shots.css";
import "./steps.css";
import { Mark, Pressable } from "@misty/ui";

type Message = { from: string; engine?: string; text: string };
type UseCase = {
  title: string; note: string;
  space: string; members: string;
  thread: readonly Message[];
  result: { icon: ReactNode; name: string; note: string };
};

const USE_CASES: readonly UseCase[] = [
  {
    title: "Catch the team up on a launch.",
    note: "Everyone's caught up in one thread, without a status meeting.",
    space: "Launch", members: "Priya, Sam, Alex and 2 agents",
    thread: [
      { from: "Priya", text: "Where are we on the launch? I was out Friday." },
      { from: "Alex's agent", engine: "claude", text: "From #launch and Gmail: the landing copy is approved, the press embargo moved to Oct 27, and Sam owns the support FAQ." },
      { from: "Sam", text: "The FAQ draft is in Files if anyone wants to check it." },
    ],
    result: { icon: <FileText size={16} />, name: "Launch plan", note: "Updated with this week's changes" },
  },
  {
    title: "Ship a fix together.",
    note: "One person reports it, an agent fixes it, another reviews it.",
    space: "Product", members: "Sam, Priya, Alex and 1 agent",
    thread: [
      { from: "Sam", text: "Signups with a + in the email are failing." },
      { from: "Priya's agent", engine: "codex", text: "Found it: the email check drops the +. The fix and three tests are ready for review." },
      { from: "Alex", text: "Looks good. Merging." },
    ],
    result: { icon: <GitPullRequest size={16} />, name: "Allow + in signup emails", note: "Reviewed by Alex" },
  },
  {
    title: "Write the weekly update as a team.",
    note: "Each person's agent adds their part to one shared draft.",
    space: "Team", members: "Alex, Sam, Priya and 2 agents",
    thread: [
      { from: "Alex's agent", engine: "claude", text: "Added growth: 1,284 signups, up 12% on last week." },
      { from: "Sam's agent", engine: "claude", text: "Added support: 46 tickets, with a median first reply of 2 hours." },
      { from: "Priya", text: "I'll write the intro and send it Monday." },
    ],
    result: { icon: <Newspaper size={16} />, name: "Weekly update", note: "Three sections, ready to send" },
  },
  {
    title: "Research a decision together.",
    note: "Everyone adds sources, and an agent sums them up for the group.",
    space: "Vendors", members: "Sam, Priya, Alex and 1 agent",
    thread: [
      { from: "Sam", text: "I added the three pricing pages and two reviews to the Lab." },
      { from: "Priya's agent", engine: "agy", text: "Compared all three on price, limits and support. The cheapest has no SSO, so the second is the best fit." },
      { from: "Alex", text: "SSO is a must. Let's go with the second." },
    ],
    result: { icon: <FlaskConical size={16} />, name: "Vendor comparison", note: "Notebook with 5 sources" },
  },
  {
    title: "Plan a trip with friends.",
    note: "An agent finds the options, and everyone picks in the group chat.",
    space: "Lisbon trip", members: "Alex, Sam, Priya and 1 agent",
    thread: [
      { from: "Alex", text: "May, six of us, somewhere near the beach?" },
      { from: "Sam's agent", engine: "claude", text: "Found three houses in Cascais that sleep six for May 14 to 18. Prices and links are in Files." },
      { from: "Priya", text: "The second one, for the pool." },
    ],
    result: { icon: <FileText size={16} />, name: "Cascais, May 14 to 18", note: "Saved to Files" },
  },
];

const Person = ({ name }: { name: string }) => <span className="mist-mock-person">{name[0]}</span>;

function CaseSpace({ useCase, active }: { useCase: UseCase; active: boolean }) {
  return (
    <div className="mist-case" data-active={active || undefined} aria-hidden={!active}>
      <div className="mist-mock">
        <header className="mist-mock-bar"><Person name={useCase.space} /><b>{useCase.space}</b><small>{useCase.members}</small></header>
        <div className="mist-mock-thread">
          {useCase.thread.map((message, index) => (
            <div key={message.from} className="mist-mock-message" style={{ "--n": index } as CSSProperties}>
              {message.engine ? <Mark of={`engine:${message.engine}`} size={16} /> : <Person name={message.from} />}
              <p><b>{message.from}</b>{message.text}</p>
            </div>
          ))}
          <div className="mist-mock-row mist-case-result" style={{ "--n": useCase.thread.length } as CSSProperties}>
            {useCase.result.icon}<b>{useCase.result.name}</b><small>{useCase.result.note}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UseCasesChapter() {
  const section = useRef<HTMLDivElement>(null);
  const [active, choose] = usePinnedSteps(section, USE_CASES.length);
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const element = list.current;
    if (!element) return;
    const place = () => {
      const items = [...element.children] as HTMLElement[];
      const gap = parseFloat(getComputedStyle(element).rowGap) || 0;
      const closed = items.map(item => (item.firstElementChild as HTMLElement).offsetHeight);
      const text = items[active].querySelector<HTMLElement>(".mist-step-note p");
      const note = text ? text.scrollHeight - (parseFloat(getComputedStyle(text).paddingBottom) || 0) : 0;
      element.style.setProperty("--ind-y", `${closed.slice(0, active).reduce((sum, h) => sum + h + gap, 0)}px`);
      element.style.setProperty("--ind-h", `${closed[active] + note + 14}px`);
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(element);
    return () => observer.disconnect();
  }, [active]);

  return (
    <Chapter id="together" title="What you can do together" ownHead>
      <div ref={section} className="mist-steps" style={{ "--steps-count": USE_CASES.length } as CSSProperties}>
        <div className="mist-steps-pin">
          <h2 id="together-title" className="mist-steps-head" data-reveal>What you can do together</h2>
          <div className="mist-steps-stage" data-reveal-stagger>
            <ol ref={list} className="mist-steps-list" aria-label="Examples">
              {USE_CASES.map((item, index) => (
                <li key={item.title}>
                  <Pressable aria-current={index === active ? "step" : undefined} onClick={() => choose(index)}>
                    {item.title}
                  </Pressable>
                  <div className="mist-step-note" aria-hidden={index !== active}><p>{item.note}</p></div>
                </li>
              ))}
            </ol>
            <div className="mist-steps-media">
              {USE_CASES.map((useCase, index) => <CaseSpace key={useCase.title} useCase={useCase} active={index === active} />)}
            </div>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
