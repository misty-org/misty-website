import { Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";

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
      <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-5 text-base leading-[27px] text-foreground/90">
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
          <span className="font-mono text-sm leading-[27px] text-muted-foreground">
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
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Without clipboard access the text can still be selected by hand.
    }
  }

  return (
    <div className="relative rounded-lg border border-border bg-muted/40">
      <pre
        aria-label={label}
        className="overflow-x-auto px-4 py-3.5 pr-12 font-mono text-[13px] leading-6 text-foreground"
      >
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
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
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm leading-6">
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
                        ? "whitespace-nowrap py-2.5 pr-4 font-mono text-[13px] font-normal text-foreground"
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
      className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-base leading-7 text-foreground/85"
    >
      {children}
    </div>
  );
}
