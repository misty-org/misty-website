import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Hand, Lock, Plus, RotateCw, X } from "lucide-react";
import { brand, SUMMARY, type BrandIcon, type TabId } from "./demoScript";

/** The sample web pages inside the Misty window. All of them are drawn here; none load a real site. */

/**
 * The agent's own browser, as the app shows it beside a chat: its tabs, back, forward and reload,
 * the page's address, and a button to take over from the agent.
 */
export function PageFrame({ tabs, active, url, children }: {
  tabs: readonly { id: TabId; icon: BrandIcon; label: string }[]; active: TabId; url: string; children: ReactNode;
}) {
  return (
    <div className="mw-page">
      <div className="mw-page-tabs">
        {tabs.map(tab => (
          <span key={tab.id} className="mw-tab" data-active={tab.id === active}><img src={brand(tab.icon)} alt="" />{tab.label}<X size={12} /></span>
        ))}
        <Plus size={14} className="mw-new-tab" />
      </div>
      <div className="mw-address">
        <ChevronLeft size={15} /><ChevronRight size={15} /><RotateCw size={13} />
        <span><Lock size={11} />{url}</span>
        <em className="mw-take-over"><Hand size={13} />Take over</em>
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
