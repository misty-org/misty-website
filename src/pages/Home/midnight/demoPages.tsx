import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Lock, RotateCw, } from "lucide-react";
import { SUMMARY, } from "./demoScript";

/** The sample web pages inside the Misty window. All of them are drawn here; none load a real site. */

export function PageFrame({ url, agent, children }: { url: string; agent?: boolean; children: ReactNode }) {
  return (
    <div className="mw-page" data-agent={agent ?? false}>
      <div className="mw-address">
        <ChevronLeft size={15} /><ChevronRight size={15} /><RotateCw size={13} />
        <span><Lock size={11} />{url}</span>
        {agent && <em className="mw-agent-note"><i />Misty is working here</em>}
      </div>
      {children}
    </div>
  );
}

/** The Launch plan doc. Its "This week" section appears once the agent writes it. */
export function DocPage({ writing, written }: { writing: boolean; written: boolean }) {
  return (
    <article className="mw-doc">
      <h4>Launch plan</h4>
      <p className="mw-doc-meta">Owner: Ana · Ships Oct 28</p>
      <h5>Goals</h5>
      <p>Open the beta to the waitlist, publish the changelog and brief support before launch day.</p>
      <h5 data-new={writing || written}>This week</h5>
      <div className="mw-doc-new" data-written={written} data-writing={writing}>
        {SUMMARY.map(line => <p key={line}>{line}</p>)}
      </div>
    </article>
  );
}
