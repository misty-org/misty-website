import { cn } from "@/lib/utils";

/**
 * Monthly or yearly billing, as two segments; the chosen one wears the neutral wash, the other
 * hovers like a quiet Button. Yearly carries what it saves.
 */
export function BillingToggle({
  label,
  saving,
  yearly,
  onChange,
}: {
  label: string;
  saving: number;
  yearly: boolean;
  onChange: (yearly: boolean) => void;
}) {
  const segment = (active: boolean) =>
    cn(
      "flex h-7 items-center gap-2 rounded-md px-3 text-sm outline-none transition-colors",
      // The unchosen segment hovers like the quiet Button: a wash, and keyboard focus shows as it.
      active
        ? "bg-accent text-foreground"
        : "text-cream-muted hover:bg-control-hover hover:text-cream focus-visible:bg-control-hover focus-visible:text-cream",
    );
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex w-fit gap-1 rounded-lg border border-border bg-background p-1"
    >
      <button
        type="button"
        role="radio"
        aria-checked={!yearly}
        className={segment(!yearly)}
        onClick={() => onChange(false)}
      >
        Monthly
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={yearly}
        className={segment(yearly)}
        onClick={() => onChange(true)}
      >
        Yearly
        <span className="rounded border border-border px-1.5 text-xs text-muted-foreground">
          Save {saving}%
        </span>
      </button>
    </div>
  );
}
