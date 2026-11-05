/**
 * The hero demo's sample world and the few tasks Misty can run in it. Nothing here touches a
 * real account: every tab is a page drawn by the website, and every step only changes `World`.
 */

export type TabId = "doc" | "slack" | "gmail";
export type BrandIcon = "google-docs" | "slack" | "gmail";

const brands = import.meta.glob<string>("../../../assets/brand-icons/*.svg", { eager: true, query: "?url", import: "default" });
export const brand = (name: BrandIcon) => brands[`../../../assets/brand-icons/${name}.svg`];

export const TABS: readonly { id: TabId; icon: BrandIcon; label: string; url: string }[] = [
  { id: "doc", icon: "google-docs", label: "Launch plan", url: "docs.google.com/launch-plan" },
  { id: "slack", icon: "slack", label: "#launch", url: "app.slack.com/launch" },
  { id: "gmail", icon: "gmail", label: "Inbox", url: "mail.google.com/inbox" },
];

/** What the three sample tabs currently show. */
export type World = {
  docWriting: boolean;
  docWritten: boolean;
  slackDraft: boolean;
  posted: boolean;
  gmailQuery: string;
  emailOpen: boolean;
  replyDraft: boolean;
  replied: boolean;
};

export type Approval = { ask: string; target: string; after: string; done: string; declined: string; decline?: Partial<World> };

/** `start` applies as the agent reaches the step, `finish` once it completes. */
export type Step = { icon: BrandIcon; text: string; tab: TabId; start?: Partial<World>; finish?: Partial<World>; approve?: Approval };

type Scenario = {
  id: string;
  prompt: string;
  /** The short label offered under "Try asking". */
  suggestion: string;
  steps: readonly Step[];
  /** Clears this task's own changes so it can run again. */
  reset?: Partial<World>;
  answer?: { lead: string; items: readonly string[] };
};

export const SUMMARY = [
  "Landing page copy approved in Slack on Tuesday.",
  "Press embargo moved to Oct 27, per Ravi's email.",
  "Support macros due Friday; Sam owns the FAQ.",
] as const;

const launch: Scenario = {
  id: "launch",
  prompt: "Catch me up on the launch from Slack and Gmail, add it to the Launch plan, then post a summary in #launch.",
  suggestion: "Catch me up on the launch and post a summary",
  reset: { docWritten: false, posted: false },
  steps: [
    { icon: "slack", text: "Read this week's #launch messages", tab: "slack" },
    { icon: "gmail", text: "Find launch emails in Gmail", tab: "gmail", start: { gmailQuery: "launch", emailOpen: false } },
    { icon: "google-docs", text: "Add a summary to the Launch plan", tab: "doc", start: { docWriting: true }, finish: { docWriting: false, docWritten: true } },
    {
      icon: "slack", text: "Post the summary in #launch", tab: "slack", start: { slackDraft: true }, finish: { slackDraft: false, posted: true },
      approve: { ask: "Post a 4-line summary to", target: "#launch", after: " in Slack?", done: "Posted to #launch", declined: "Okay, nothing was posted.", decline: { slackDraft: false } },
    },
  ],
};

const reply: Scenario = {
  id: "reply",
  prompt: "Reply to Ravi and confirm the Oct 27 embargo works for us.",
  suggestion: "Reply to Ravi about the embargo",
  reset: { replyDraft: false, replied: false },
  steps: [
    { icon: "gmail", text: "Open Ravi's email about the embargo", tab: "gmail", start: { gmailQuery: "Ravi" }, finish: { emailOpen: true } },
    { icon: "google-docs", text: "Check the ship date in the Launch plan", tab: "doc" },
    {
      icon: "gmail", text: "Reply to Ravi", tab: "gmail", start: { emailOpen: true, replyDraft: true }, finish: { replyDraft: false, replied: true },
      approve: { ask: "Send this reply to", target: "Ravi Shah", after: "?", done: "Sent to Ravi", declined: "Okay, I left it as a draft." },
    },
  ],
};

const open: Scenario = {
  id: "open",
  prompt: "What's still open before launch?",
  suggestion: "What's still open before launch?",
  steps: [
    { icon: "google-docs", text: "Read the Launch plan", tab: "doc" },
    { icon: "slack", text: "Look for open asks in #launch", tab: "slack" },
    { icon: "gmail", text: "Check for unanswered launch emails", tab: "gmail", start: { gmailQuery: "launch", emailOpen: false } },
  ],
  answer: {
    lead: "Three things are still open. I only read your tabs, so there's nothing to approve.",
    items: [
      "The changelog needs a final pass. Jo asked in #launch on Thursday.",
      "Support macros and the FAQ are due Friday. Sam owns them.",
      "Lena's interview request for launch week hasn't had a reply.",
    ],
  },
};

export const SCENARIOS = [launch, reply, open] as const;
