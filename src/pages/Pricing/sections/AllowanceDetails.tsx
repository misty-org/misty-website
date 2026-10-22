import { ownerRules, planLimitRows } from "../data";

export default function AllowanceDetails() {
  return (
    <section
      aria-labelledby="allowances-heading"
      className="mx-auto mb-20 max-w-6xl"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          How allowances work
        </p>
        <h2
          id="allowances-heading"
          className="mt-3 text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-4xl"
        >
          Your allowance and the Space allowance work together.
        </h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Your plan follows you across Misty. Every Space also has capacity of
          its own, set by the plan of the person who owns it.
        </p>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ownerRules.map((rule) => (
          <article
            key={rule.title}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h3 className="text-sm font-medium leading-5 text-foreground">
              {rule.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {rule.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Basic, Pro, and Max plan allowances
            </caption>
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-4 font-medium text-foreground" scope="col">
                  Plan allowance
                </th>
                <th className="px-5 py-4 font-medium text-foreground" scope="col">
                  Basic
                </th>
                <th className="px-5 py-4 font-medium text-foreground" scope="col">
                  Pro
                </th>
                <th className="px-5 py-4 font-medium text-foreground" scope="col">
                  Max
                </th>
              </tr>
            </thead>
            <tbody>
              {planLimitRows.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-border last:border-b-0"
                >
                  <th
                    className="px-5 py-4 font-medium text-foreground"
                    scope="row"
                  >
                    {row.label}
                  </th>
                  <td className="px-5 py-4 text-muted-foreground">
                    {row.basic}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {row.pro}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {row.max}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
