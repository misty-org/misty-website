import { NavLink } from "react-router";
import { DOCS_URL } from "@/lib/site";
import { useReveal } from "@/hooks/useReveal";

type ResourceCard = { label: string; title: string; href: string };
const linkClass = "text-black dark:text-white transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function ResourceRow({ id, title, cards, href, linkLabel = "View all" }: {
  id: string; title: string; cards: ResourceCard[]; href: string; linkLabel?: string;
}) {
  const ref = useReveal<HTMLElement>();
  const external = href.startsWith("http");
  return (
    <section ref={ref} className="reveal" aria-labelledby={`${id}-preview-title`} data-resource-preview={id}>
      <h2 id={`${id}-preview-title`} className="mb-5 text-2xl font-medium tracking-tight">{title}</h2>
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
          : <NavLink to={href} className={linkClass} aria-label={`${linkLabel} ${title.toLowerCase()}`}>{linkLabel} <span aria-hidden="true">→</span></NavLink>}
      </div>
    </section>
  );
}

export function ResourcePreview() {
  return (
    <section id="resources" aria-label="Updates and resources" className="site-container relative grid scroll-mt-24 gap-12 py-6 sm:gap-14">
      <span id="updates" className="absolute scroll-mt-24" />
      <ResourceRow id="blog" title="Blog" href="/blog" linkLabel="Visit blog" cards={[{ label: "Work in progress", title: "No posts yet.", href: "/blog" }]} />
      <ResourceRow id="changelog" title="Changelog" href="/changelog" linkLabel="Visit changelog" cards={[{ label: "Work in progress", title: "No updates yet.", href: "/changelog" }]} />
      <ResourceRow id="roadmap" title="Roadmap" href="/roadmap" linkLabel="Visit roadmap" cards={[{ label: "Work in progress", title: "Nothing published yet.", href: "/roadmap" }]} />
      {import.meta.env.DEV && <ResourceRow id="docs" title="Docs" href={DOCS_URL} linkLabel="Preview docs" cards={[
        { label: "Work in progress", title: "Documentation is on its way.", href: DOCS_URL },
      ]} />}
    </section>
  );
}
