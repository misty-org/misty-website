import { NavLink } from "react-router";
import { DOCS_URL } from "@/lib/site";
import { posts } from "@/pages/Blog/data";
import { changelog } from "@/pages/Changelog/data";
import { phases } from "@/pages/Roadmap/data";

type ResourceCard = { label: string; title: string; href: string };
const linkClass = "text-black dark:text-white transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function ResourceRow({ id, title, cards, href, linkLabel = "View all" }: {
  id: string; title: string; cards: ResourceCard[]; href: string; linkLabel?: string;
}) {
  const external = href.startsWith("http");
  return (
    <section aria-labelledby={`${id}-preview-title`} data-resource-preview={id}>
      <h2 id={`${id}-preview-title`} className="marketing-heading mb-5">{title}</h2>
      <div className="resource-flat-grid">
        {cards.map((card) => {
          const content = <><span className="block text-sm leading-6 text-[var(--marketing-muted)]">{card.label}</span><span className="mt-1 block text-base leading-6 text-[var(--marketing-foreground)]">{card.title}</span></>;
          return card.href.startsWith("http")
            ? <a key={card.title} href={card.href} className="resource-flat-card">{content}</a>
            : <NavLink key={card.title} to={card.href} className="resource-flat-card">{content}</NavLink>;
        })}
      </div>
      <div className="mt-5 text-sm">
        {external ? <a href={href} className={linkClass}>{linkLabel} <span aria-hidden="true">→</span></a>
          : <NavLink to={href} className={linkClass}>{linkLabel} <span aria-hidden="true">→</span></NavLink>}
      </div>
    </section>
  );
}

export function ResourcePreview() {
  return (
    <section id="resources" aria-label="Updates and resources" className="site-container relative grid scroll-mt-24 gap-12 py-6 sm:gap-14">
      <span id="updates" className="absolute scroll-mt-24" />
      <ResourceRow id="blog" title="Blog" href="/blog" linkLabel="Visit blog" cards={[
        ...posts.slice(0, 1).map(post => ({ label: `${post.tag} · ${post.date}`, title: post.title, href: "/blog" })),
        { label: "Article preview · Spaces", title: "A shared home for your project’s context", href: "/blog" },
        { label: "Article preview · Workflows", title: "Bring your tools into one Space", href: "/blog" },
        { label: "Article preview · Collaboration", title: "Pick up where your team left off", href: "/blog" },
      ]} />
      <ResourceRow id="changelog" title="Changelog" href="/changelog" linkLabel="Visit changelog" cards={changelog.flatMap(entry => entry.groups.map(group => ({
        label: `${entry.version} · ${entry.status === "beta" ? "Private beta" : "Released"}`,
        title: group.heading,
        href: "/changelog",
      }))).slice(0, 4)} />
      <ResourceRow id="roadmap" title="Roadmap" href="/roadmap" linkLabel="Visit roadmap" cards={phases.flatMap(phase => phase.items.map(item => ({
        label: phase.label,
        title: item.title,
        href: "/roadmap",
      }))).filter(card => ["Shared Spaces", "Space-scoped agents", "Tablet builds", "Broader integration access"].includes(card.title))} />
      {import.meta.env.DEV && <ResourceRow id="docs" title="Docs" href={DOCS_URL} linkLabel="Preview docs" cards={[
        { label: "Getting started", title: "Set up your Misty workspace", href: `${DOCS_URL}/start` },
        { label: "CLI", title: "Develop and run Misty", href: `${DOCS_URL}/cli/overview` },
        { label: "Extensions", title: "Build your own panels", href: `${DOCS_URL}/extensions/overview` },
        { label: "Server", title: "Explore the API and deployment", href: `${DOCS_URL}/server/overview` },
      ]} />}
    </section>
  );
}
