import { Check, X } from "lucide-react";
import { engineRows, engines, type Support } from "../data";

function Mark({ value }: { value: Support }) {
  if (value === true) return <Check className="mx-auto size-[18px] text-foreground" aria-label="Yes" />;
  if (value === false) return <X className="mx-auto size-[18px] text-muted-foreground/60" aria-label="No" />;
  return <span className="text-muted-foreground">{value}</span>;
}

/** The three web engines browsers are built on, compared by what extensions can do on each. */
export default function EngineTable() {
  return (
    <section aria-labelledby="kiri-compare" className="pt-8">
      <h2 id="kiri-compare" className="sr-only">
        Chromium, Gecko and Kiri compared
      </h2>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground">
            <tr>
              <td />
              {engines.map((name) => (
                <th key={name} scope="col" className={`px-4 py-3 text-center font-medium ${name === "Kiri" ? "text-foreground" : ""}`}>
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {engineRows.map(({ label, cells }) => (
              <tr key={label} className="border-b border-border last:border-b-0">
                <th scope="row" className="px-4 py-4 text-left font-normal text-foreground">{label}</th>
                {cells.map((cell, index) => (
                  <td key={engines[index]} className={`px-4 py-4 text-center ${index === 2 ? "bg-muted/50" : ""}`}>
                    <Mark value={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
