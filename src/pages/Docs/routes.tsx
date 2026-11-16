import { redirect, type RouteObject } from "react-router";

import { marketingCopy } from "@/content/marketingCopy";
import { siteLink } from "@/lib/site";
import DocsLayout from "./DocsLayout";
import IntegrationPage from "./IntegrationPage";
import { integrationDocs } from "./integrations";
import AgentsPage from "./pages/AgentsPage";
import Chats from "./pages/Chats";
import ChooseAgent from "./pages/ChooseAgent";
import Connect from "./pages/Connect";
import Limits from "./pages/Limits";
import Maintenance from "./pages/Maintenance";
import Overview from "./pages/Overview";
import Plans from "./pages/Plans";
import Quickstart from "./pages/Quickstart";
import SelfHosting from "./pages/SelfHosting";
import Spaces from "./pages/Spaces";
import Studio from "./pages/Studio";
import Troubleshooting from "./pages/Troubleshooting";
import WhereThingsRun from "./pages/WhereThingsRun";
import YourData from "./pages/YourData";

const docsTitle = (page: string) => `${page} | Misty docs`;

/** Sends an old docs address to its new page, on whichever host this is. */
function movedTo(path: string) {
  const target = siteLink(path);
  return redirect("path" in target ? target.path : target.href);
}

/**
 * The docs pages, served at the root of docs.mistysys.com (the router drops this route's
 * own path there). Each env file gets its own page from the integrations data.
 */
export const docsRoutes: RouteObject = {
  path: "docs",
  element: <DocsLayout />,
  children: [
    {
      index: true,
      element: <Overview />,
      handle: {
        title: "Docs | Misty",
        description: marketingCopy.metadata.docs,
      },
    },
    {
      path: "quickstart",
      element: <Quickstart />,
      handle: {
        title: docsTitle("Quickstart"),
        description:
          "Install Misty, sign in, connect an agent and start working with your team.",
      },
    },
    {
      path: "connect",
      element: <Connect />,
      handle: {
        title: docsTitle("Connect to a server"),
        description:
          "Connect the Misty app to Misty Cloud or your own server, or use it on this computer only.",
      },
    },
    {
      path: "choose-agent",
      element: <ChooseAgent />,
      handle: {
        title: docsTitle("Choose your agent"),
        description:
          "The agents Misty works with, such as Claude Code and Codex, and how to set one up.",
      },
    },
    {
      path: "chats",
      element: <Chats />,
      handle: {
        title: docsTitle("Agent chats"),
        description:
          "Start a chat with an agent, give it context, approve its plans and review its work.",
      },
    },
    {
      path: "spaces",
      element: <Spaces />,
      handle: {
        title: docsTitle("Spaces"),
        description:
          "Create a space, invite people, and share chat, docs, drawings and files with them and their agents.",
      },
    },
    {
      path: "agents",
      element: <AgentsPage />,
      handle: {
        title: docsTitle("Agents page"),
        description:
          "Connect apps, add skills and install plugins for your agents.",
      },
    },
    {
      path: "studio",
      element: <Studio />,
      handle: {
        title: docsTitle("Studio"),
        description:
          "The 3D room where your agents work, and where you hire new ones.",
      },
    },
    {
      path: "plans",
      element: <Plans />,
      handle: {
        title: docsTitle("Plans and Boosts"),
        description:
          "Get Misty+, boost a space, and change or cancel a plan on Misty Cloud.",
      },
    },
    {
      path: "privacy",
      element: <YourData />,
      handle: {
        title: docsTitle("Your data"),
        description:
          "What Misty stores where, and how to get a copy or delete it.",
      },
    },
    {
      path: "self-hosting",
      element: <SelfHosting />,
      handle: {
        title: docsTitle("Set up a server"),
        description:
          "Run your own Misty server with one Compose file, three env files and a setup container.",
      },
    },
    ...integrationDocs.map((doc) => ({
      path: `self-hosting/${doc.slug}`,
      element: <IntegrationPage doc={doc} />,
      handle: {
        title: docsTitle(doc.file),
        description: `${doc.file}: ${doc.summary}`,
      },
    })),
    {
      path: "maintenance",
      element: <Maintenance />,
      handle: {
        title: docsTitle("Updates and backups"),
        description:
          "Update and back up a Misty server, and what the AGPL asks of a changed one.",
      },
    },
    {
      path: "limits",
      element: <Limits />,
      handle: {
        title: docsTitle("Space levels"),
        description:
          "What each space level allows on Misty Cloud, and the limits of each plan.",
      },
    },
    {
      path: "where-things-run",
      element: <WhereThingsRun />,
      handle: {
        title: docsTitle("Where things run"),
        description:
          "Which parts of Misty run on your computer and which run on a server.",
      },
    },
    {
      path: "troubleshooting",
      element: <Troubleshooting />,
      handle: {
        title: docsTitle("Troubleshooting"),
        description:
          "Fixes for common problems with signing in, agents and spaces.",
      },
    },
    // Old docs addresses.
    { path: "models", loader: () => movedTo("/docs/choose-agent") },
    { path: "self-hosting/composio", loader: () => movedTo("/docs/agents") },
  ],
};
