import type { ReactNode } from "react";
import { NavLink } from "react-router";

import { PageHeader, PublicPage } from "@/components/marketing";
import { legalInfo } from "./legalInfo";

export type LegalSectionDef = {
  id: string;
  title: string;
  /** One-sentence plain-language summary shown above the section body. */
  inShort?: string;
  body: ReactNode;
};

/**
 * Shared shell for the legal documents: header, last-updated date, a short
 * plain-language summary, a table of contents, and numbered sections.
 */
export default function LegalPage({
  title,
  summary,
  highlights,
  intro,
  sections,
}: {
  title: string;
  summary: string;
  highlights?: ReactNode[];
  intro?: ReactNode;
  sections: LegalSectionDef[];
}) {
  return (
    <PublicPage>
      <PageHeader label="Legal" title={title} description={summary} />

      <div className="max-w-3xl">
        <p className="text-sm text-muted-foreground">
          Last updated {legalInfo.lastUpdated}
        </p>

        {intro ? <div className="mt-8 grid gap-4">{intro}</div> : null}

        {highlights?.length ? (
          <section
            aria-labelledby="legal-short-version"
            className="mt-10 rounded-xl border border-border bg-card p-5 sm:p-6"
          >
            <h2
              id="legal-short-version"
              className="text-base font-medium text-foreground"
            >
              The short version
            </h2>
            <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm leading-6 text-muted-foreground marker:text-muted-foreground/60">
              {highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <nav aria-labelledby="legal-contents" className="mt-10">
          <h2
            id="legal-contents"
            className="text-sm font-medium text-foreground"
          >
            Contents
          </h2>
          <ol className="mt-3 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2 sm:gap-x-8">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="hover:text-foreground hover:underline hover:underline-offset-4"
                >
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-14 grid gap-12">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="scroll-mt-24"
            >
              <h2
                id={`${section.id}-heading`}
                className="text-xl font-medium tracking-[-0.02em] text-foreground"
              >
                {index + 1}. {section.title}
              </h2>
              {section.inShort ? (
                <p className="mt-3 text-sm leading-6 text-foreground/80">
                  <span className="font-medium text-foreground">In short:</span>{" "}
                  {section.inShort}
                </p>
              ) : null}
              <div className="mt-4 grid gap-4 text-base leading-7 text-muted-foreground">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PublicPage>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="grid list-disc gap-2 pl-5 marker:text-muted-foreground/60">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export function LegalSubheading({ children }: { children: ReactNode }) {
  return (
    <h3 className="pt-2 text-base font-medium text-foreground">{children}</h3>
  );
}

/** Internal routes use the router; mailto and external URLs stay plain links. */
export function LegalLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  const className =
    "text-foreground underline underline-offset-4 hover:text-foreground/80";
  if (to.startsWith("/")) {
    return (
      <NavLink to={to} className={className}>
        {children}
      </NavLink>
    );
  }
  const external = /^https?:\/\//i.test(to);
  return (
    <a
      href={to}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function LegalEmail({ address }: { address: string }) {
  return <LegalLink to={`mailto:${address}`}>{address}</LegalLink>;
}

export function LegalTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm leading-6">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="py-2 pr-4 font-medium text-foreground"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border/60 align-top">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-2 pr-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
