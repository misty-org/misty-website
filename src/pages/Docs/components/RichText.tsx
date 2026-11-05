import { Fragment } from "react";
import { SiteLink } from "@/components/SiteLink";

/** Splits on `code` spans and [text](href) links, the only markup docs data uses. */
const TOKEN = /(`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

const docLinkClass =
  "text-foreground underline underline-offset-4 transition-opacity hover:opacity-75";

function InlineCode({ children }: { children: string }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground [overflow-wrap:anywhere]">
      {children}
    </code>
  );
}

function DocLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  if (href.startsWith("/")) {
    return (
      <SiteLink to={href} className={docLinkClass}>
        {children}
      </SiteLink>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={docLinkClass}
    >
      {children}
    </a>
  );
}

/**
 * Plain text from the docs data, with `code` and [links](/docs/...) rendered.
 * Keeps the data files readable and easy to update by hand.
 */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, index) => {
        if (!part) return null;
        if (part.startsWith("`") && part.endsWith("`")) {
          return <InlineCode key={index}>{part.slice(1, -1)}</InlineCode>;
        }
        const link = LINK.exec(part);
        if (link) {
          return (
            <DocLink key={index} href={link[2]}>
              {link[1]}
            </DocLink>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}
