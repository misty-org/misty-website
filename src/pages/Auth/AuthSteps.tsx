import type { ReactNode } from "react";

export interface AuthStep {
  text: string;
  action?: ReactNode;
}

/** Numbered steps for an AuthCard, each with its own action beside it. */
export default function AuthSteps({ steps }: { steps: AuthStep[] }) {
  return (
    <ol className="divide-y divide-border">
      {steps.map((step, index) => (
        <li
          key={step.text}
          className="grid grid-cols-[1.75rem_1fr] gap-x-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[1.75rem_1fr_auto]"
        >
          <span className="flex size-7 items-center justify-center rounded-full border border-border text-sm tabular-nums text-foreground">
            {index + 1}
          </span>
          <p className="text-base leading-7 text-pretty text-foreground">{step.text}</p>
          {step.action ? (
            <div className="col-start-2 mt-3 sm:col-start-3 sm:-mt-1">{step.action}</div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
