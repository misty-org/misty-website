import { NavLink } from "react-router";
import { changelog } from "@/pages/Changelog/data";
import { phases } from "@/pages/Roadmap/data";

type ResourceCard = { title: string; href: string };
const linkClass = "text-black dark:text-white transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
/** Each column shows its latest entry; the link goes to the rest. */
const PER_COLUMN = 1;

function ResourceColumn({ id, title, cards, href, linkLabel }: {
  id: string; title: string; cards: ResourceCard[]; href: string; linkLabel: string;
}) {
  return (
    <section aria-labelledby={`${id}-preview-title`} data-resource-preview={id} className="mist-resource-column">
      <h2 id={`${id}-preview-title`}>{title}</h2>
      <div className="mist-resource-cards">
        {cards.slice(0, PER_COLUMN).map((card) => (
          <NavLink key={card.title} to={card.href} className="resource-flat-card">
            <span className="block text-base leading-6 text-[var(--marketing-foreground)]">{card.title}</span>
          </NavLink>
        ))}
      </div>
      <div className="mt-2.5 text-sm">
        <NavLink to={href} className={linkClass}>{linkLabel} <span aria-hidden="true">→</span></NavLink>
      </div>
    </section>
  );
}

/** The latest from the changelog and roadmap, side by side in two columns. */
export function ResourcePreview() {
  return (
    <section id="resources" aria-label="Updates and resources" className="mist-container mist-resource-grid">
      <span id="updates" className="absolute scroll-mt-24" />
      <ResourceColumn id="changelog" title="Changelog" href="/changelog" linkLabel="Visit changelog" cards={changelog.flatMap(entry => entry.groups.map(group => ({
        title: group.heading,
        href: "/changelog",
      })))} />
      <ResourceColumn id="roadmap" title="Roadmap" href="/roadmap" linkLabel="Visit roadmap" cards={phases.flatMap(phase => phase.items.map(item => ({
        title: item.title,
        href: "/roadmap",
      }))).filter(card => ["Shared Spaces", "Space-scoped agents"].includes(card.title))} />
    </section>
  );
}
