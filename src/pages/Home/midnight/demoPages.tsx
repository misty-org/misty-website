import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Lock, RotateCw, Search } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { REPLY, SUMMARY, type World } from "./demoScript";

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

const MESSAGES = [
  { from: "Ana Ortiz", at: "Tue 10:12", text: "Pricing page copy is approved. Shipping it with the beta." },
  { from: "Ravi Shah", at: "Wed 16:40", text: "Press embargo is moving. Sent the details by email." },
  { from: "Sam Lee", at: "Thu 09:05", text: "I'll own the support FAQ. Macros will be ready Friday." },
  { from: "Jo Kim", at: "Thu 11:30", text: "Changelog draft is in the Launch plan. Can someone give it a final pass?" },
] as const;

function Avatar({ name }: { name: string }) {
  return <span className="mw-avatar" data-name={name}>{name === "You" ? <BrandLogo className="size-3.5" /> : name[0]}</span>;
}

export function SlackPage({ world }: { world: World }) {
  return (
    <section className="mw-sheet mw-slack">
      <header><b># launch</b><span>5 members</span></header>
      <ol>
        {MESSAGES.map(message => (
          <li key={message.at}><Avatar name={message.from} /><div><p><b>{message.from}</b><time>{message.at}</time></p><p>{message.text}</p></div></li>
        ))}
        {world.posted && (
          <li className="mw-new-message"><Avatar name="You" /><div><p><b>You</b><time>just now · via Misty</time></p><p>Launch catch-up:</p>{SUMMARY.map(line => <p key={line}>· {line}</p>)}</div></li>
        )}
      </ol>
      <div className="mw-slack-box" data-draft={world.slackDraft}>
        {world.slackDraft
          ? <><span className="mw-draft-label">Draft from Misty</span><p>Launch catch-up:</p>{SUMMARY.map(line => <p key={line}>· {line}</p>)}</>
          : <p>Message #launch</p>}
      </div>
    </section>
  );
}

const EMAILS = [
  { from: "Ravi Shah", subject: "Embargo moved to Oct 27", preview: "Quick heads up: the outlet asked to move the embargo up a day…", at: "Wed", tags: "launch press" },
  { from: "Lena Park", subject: "Interview for launch week?", preview: "Would Ana have 20 minutes for a call during launch week…", at: "Wed", tags: "launch press" },
  { from: "Jo Kim", subject: "Changelog draft", preview: "It's in the Launch plan. Could you read it before Friday?", at: "Tue", tags: "launch" },
  { from: "Billing", subject: "Your October invoice", preview: "Your invoice for October is ready to view.", at: "Mon", tags: "" },
] as const;

const matches = (email: (typeof EMAILS)[number], query: string) =>
  !query || `${email.from} ${email.subject} ${email.preview} ${email.tags}`.toLowerCase().includes(query.toLowerCase());

export function GmailPage({ world }: { world: World }) {
  return (
    <section className="mw-sheet mw-gmail">
      <header><Search size={13} /><span data-filled={!!world.gmailQuery}>{world.gmailQuery || "Search mail"}</span></header>
      {world.emailOpen ? (
        <div className="mw-email">
          <h4>Embargo moved to Oct 27</h4>
          <p className="mw-email-from"><Avatar name="Ravi Shah" /><b>Ravi Shah</b><time>Wed 16:32</time></p>
          <p>Quick heads up: the outlet asked to move the embargo up a day, to Oct 27 at 9am PT. Can you confirm that still works on your side?</p>
          {world.replied && <div className="mw-new-message mw-email-reply"><p className="mw-email-from"><Avatar name="You" /><b>You</b><time>just now · via Misty</time></p><p>{REPLY}</p></div>}
          {world.replyDraft && <div className="mw-slack-box" data-draft><span className="mw-draft-label">Draft from Misty</span><p>{REPLY}</p></div>}
        </div>
      ) : (
        <ol>
          {EMAILS.filter(email => matches(email, world.gmailQuery)).map(email => (
            <li key={email.subject}><b>{email.from}</b><p><strong>{email.subject}</strong> · {email.preview}</p><time>{email.at}</time></li>
          ))}
        </ol>
      )}
    </section>
  );
}
