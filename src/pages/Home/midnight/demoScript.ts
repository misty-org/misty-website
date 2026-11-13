/**
 * The Agents chapter's sample task. Nothing here touches a real account: every tab is a page
 * drawn by the website.
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

export type Step = { icon: BrandIcon; text: string };

/** The one task the Agents chapter plays: its prompt and the steps the agent takes. */
type Task = { prompt: string; steps: readonly Step[] };

export const SUMMARY = [
  "Landing page copy approved in Slack on Tuesday.",
  "Press embargo moved to Oct 27, per Ravi's email.",
  "Support macros due Friday; Sam owns the FAQ.",
] as const;

export const LAUNCH: Task = {
  prompt: "Catch me up on the launch from Slack and Gmail, add it to the Launch plan, then post a summary in #launch.",
  steps: [
    { icon: "slack", text: "Read this week's #launch messages" },
    { icon: "gmail", text: "Find launch emails in Gmail" },
    { icon: "google-docs", text: "Add a summary to the Launch plan" },
    { icon: "slack", text: "Post the summary in #launch" },
  ],
};
