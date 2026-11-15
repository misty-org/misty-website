import { redirect, type RouteObject } from "react-router";

import { marketingCopy } from "@/content/marketingCopy";
import { siteLink } from "@/lib/site";
import DocsLayout from "./DocsLayout";
import IntegrationPage from "./IntegrationPage";
import { integrationDocs } from "./integrations";
import Connect from "./pages/Connect";
import Maintenance from "./pages/Maintenance";
import Models from "./pages/Models";
import Overview from "./pages/Overview";
import SelfHosting from "./pages/SelfHosting";

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
      path: "connect",
      element: <Connect />,
      handle: {
        title: docsTitle("Connect the app"),
        description:
          "Connect the Misty app to Pro or your own server, or use it on this computer only.",
      },
    },
    {
      path: "models",
      element: <Models />,
      handle: {
        title: docsTitle("Models"),
        description:
          "The AI Misty can use, from Claude Code and Codex to your own API keys, and what each costs.",
      },
    },
    {
      path: "self-hosting",
      element: <SelfHosting />,
      handle: {
        title: docsTitle("Run a server"),
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
      // An old docs page; connected apps are explained under Models now.
      path: "self-hosting/composio",
      loader: () => movedTo("/docs/models#apps"),
    },
    {
      path: "maintenance",
      element: <Maintenance />,
      handle: {
        title: docsTitle("Updates and backups"),
        description:
          "Update and back up a Misty server, and what the AGPL asks of a changed one.",
      },
    },
  ],
};
