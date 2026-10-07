import { NavLink } from "react-router";
import { posts } from "@/pages/Blog/data";
import { changelog } from "@/pages/Changelog/data";
import { phases } from "@/pages/Roadmap/data";

type ResourceCard = { label: string; title: string; href: string };
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
            <span className="block text-sm leading-6 text-[var(--marketing-muted)]">{card.label}</span>
            <span className="mt-1 block text-base leading-6 text-[var(--marketing-foreground)]">{card.title}</span>
          </NavLink>
        ))}
      </div>
      <div className="mt-2.5 text-sm">
        <NavLink to={href} className={linkClass}>{linkLabel} <span aria-hidden="true">→</span></NavLink>
      </div>
    </section>
  );
}

/** The latest from the blog, changelog and roadmap, side by side in three columns. */
export function ResourcePreview() {
  return (
    <section id="resources" aria-label="Updates and resources" className="mist-container mist-resource-grid">
      <span id="updates" className="absolute scroll-mt-24" />
      <ResourceColumn id="blog" title="Blog" href="/blog" linkLabel="Visit blog" cards={[
        ...posts.slice(0, 1).map(post => ({ label: `${post.tag} · ${post.date}`, title: post.title, href: "/blog" })),
        { label: "Article preview · Spaces", title: "A shared home for your project’s context", href: "/blog" },
      ]} />
      <ResourceColumn id="changelog" title="Changelog" href="/changelog" linkLabel="Visit changelog" cards={changelog.flatMap(entry => entry.groups.map(group => ({
        label: `${entry.version} · ${entry.status === "beta" ? "Private beta" : "Released"}`,
        title: group.heading,
        href: "/changelog",
      })))} />
      <ResourceColumn id="roadmap" title="Roadmap" href="/roadmap" linkLabel="Visit roadmap" cards={phases.flatMap(phase => phase.items.map(item => ({
        label: phase.label,
        title: item.title,
        href: "/roadmap",
      }))).filter(card => ["Shared Spaces", "Space-scoped agents"].includes(card.title))} />
    </section>
  );
}
