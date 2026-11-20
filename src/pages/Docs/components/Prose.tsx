import { CodeBlock as SharedCodeBlock } from "@misty/ui";
import type { ReactNode } from "react";

import { RichText } from "./RichText";

/** A titled part of a docs page. The id makes it linkable. */
export function DocSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-20">
      <h2
        id={`${id}-heading`}
        className="text-2xl font-semibold leading-8 tracking-[-0.03em] text-foreground"
      >
        {title}
      </h2>
      <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-5 text-page leading-[1.6875rem] text-foreground/90">
        {children}
      </div>
    </section>
  );
}

/** A paragraph of docs data text, with `code` and [links](...) rendered. */
export function P({ text }: { text: string }) {
  return (
    <p>
      <RichText text={text} />
    </p>
  );
}

export function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((text) => (
        <P key={text} text={text} />
      ))}
    </>
  );
}

/** Numbered steps; each step is one sentence or two. */
export function Steps({ items }: { items: string[] }) {
  return (
    <ol className="grid gap-3">
      {items.map((text, index) => (
        <li key={text} className="grid grid-cols-[2rem_1fr] gap-2">
          <span className="font-mono text-control leading-[1.6875rem] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>
            <RichText text={text} />
          </span>
        </li>
      ))}
    </ol>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid list-disc gap-2 pl-6 marker:text-muted-foreground/60">
      {items.map((text) => (
        <li key={text}>
          <RichText text={text} />
        </li>
      ))}
    </ul>
  );
}

/** A command or file to copy. */
export function CodeBlock({ code, label }: { code: string; label?: string }) {
  return <SharedCodeBlock code={code} aria-label={label} copyLabel="Copy to clipboard" />;
}

/** A plain-text table from docs data. The first column is the row's label. */
export function DocTable({
  columns,
  rows,
  monoFirstColumn = false,
}: {
  columns: string[];
  rows: string[][];
  monoFirstColumn?: boolean;
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[36rem] border-collapse text-left text-control leading-6">
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
          {rows.map((row) => (
            <tr
              key={row.join("|")}
              className="border-b border-border/60 align-top"
            >
              {row.map((cell, index) =>
                index === 0 ? (
                  <th
                    key={index}
                    scope="row"
                    className={
                      monoFirstColumn
                        ? "whitespace-nowrap py-2.5 pr-4 font-mono text-meta font-normal text-foreground"
                        : "py-2.5 pr-4 font-normal text-foreground"
                    }
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={index} className="py-2.5 pr-4">
                    <RichText text={cell} />
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A short aside, for what a reader must not miss. Gray, never colored. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <div
      role="note"
      className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-page leading-7 text-foreground/85"
    >
      {children}
    </div>
  );
}
