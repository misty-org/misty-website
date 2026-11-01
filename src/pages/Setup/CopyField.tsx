import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** A labeled value to copy, such as a server address or a setup key. */
export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Without clipboard access the value can still be selected by hand.
    }
  }

  return (
    <div className="grid gap-1.5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-muted/40 py-1.5 pl-4 pr-1.5">
        <code className="min-w-0 flex-1 break-all font-mono text-[0.8125rem] leading-6 text-foreground">
          {value}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  );
}
