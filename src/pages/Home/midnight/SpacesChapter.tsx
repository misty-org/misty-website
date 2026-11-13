import { useState } from "react";
import { FolderOpen, ImagePlus, ListTodo, MessagesSquare, NotebookPen, type LucideIcon } from "lucide-react";
import { Chapter } from "./Chapter";
import { ProductImage } from "./ProductImage";
import "./spaces.css";

/**
 * The Space part of the homepage story: an island of tabs, one per thing a Space holds, over one
 * large screenshot. Claims follow misty/src/features/spaces (chat, journal, planner, calendar,
 * library).
 */

/**
 * Each tab's sentence and screenshot. Drop a capture at `src` (under public/) and it replaces the
 * placeholder; until then the frame shows where the file goes. Library uses the existing capture.
 */
const SPACE_TABS: { id: string; name: string; icon: LucideIcon; title: string; src?: string }[] = [
  { id: "chat", name: "Chat", icon: MessagesSquare, title: "Chat with people and agents in one thread.", src: "/screenshots/spaces/chat.webp" },
  { id: "journal", name: "Journal", icon: NotebookPen, title: "Write docs and draw together, live.", src: "/screenshots/spaces/journal.webp" },
  { id: "planner", name: "Planner", icon: ListTodo, title: "Plan tasks and dates on a shared calendar.", src: "/screenshots/spaces/planner.webp" },
  { id: "library", name: "Library", icon: FolderOpen, title: "Keep project files in one shared library." },
];

/** A screenshot, or a labeled placeholder while the file is missing. */
function SpaceShot({ src, name }: { src: string; name: string }) {
  const [missing, setMissing] = useState(false);
  if (missing) {
    return (
      <div className="mist-space-placeholder" data-placeholder={src}>
        <ImagePlus size={16} strokeWidth={1.75} aria-hidden />
        <span>{name} screenshot</span>
        <code>public{src}</code>
      </div>
    );
  }
  return <img src={src} alt={`Misty Space ${name.toLowerCase()}`} width={1600} height={1000} onError={() => setMissing(true)} />;
}

export function SpacesChapter() {
  const [index, setIndex] = useState(0);
  const current = SPACE_TABS[index];
  return (
    <Chapter id="spaces" title={<>A space for your people{" "}<span>and their agents.</span></>}>
      <div className="mist-space" data-reveal>
        <div className="mist-space-island" role="tablist" aria-label="Apps in a Space">
          {SPACE_TABS.map(({ id, name, icon: Icon }, position) => (
            <button key={id} id={`mist-space-tab-${id}`} type="button" role="tab" aria-selected={position === index}
              aria-controls={`mist-space-pane-${id}`} onClick={() => setIndex(position)}>
              <Icon size={16} strokeWidth={1.75} aria-hidden />{name}
            </button>
          ))}
        </div>
        <h3 key={current.id} className="mist-space-title" aria-live="polite">{current.title}</h3>
        <div className="mist-space-stage">
          {SPACE_TABS.map(({ id, name, src }, position) => (
            <div key={id} id={`mist-space-pane-${id}`} role="tabpanel" aria-labelledby={`mist-space-tab-${id}`}
              className="mist-space-pane" hidden={position !== index}>
              {src ? <SpaceShot src={src} name={name} /> : <ProductImage slot="shared" />}
            </div>
          ))}
        </div>
      </div>
    </Chapter>
  );
}
