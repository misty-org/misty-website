import { createBrowserRouter, redirect, type RouteObject } from "react-router";
import App from "./App";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import ConfirmEmail from "./pages/ConfirmEmail";
import ContinueFromApp from "./pages/ContinueFromApp";
import SignInLink from "./pages/SignInLink";
import NotFound from "./pages/NotFound";
import Settings from "./pages/AccountSettings";
import Changelog from "./pages/Changelog";
import Blog from "./pages/Blog";
import Roadmap from "./pages/Roadmap";
import Pricing from "./pages/Pricing";
import Download from "./pages/Download";
import Setup from "./pages/Setup";
import CloudWelcome from "./pages/CloudWelcome";
import Connected from "./pages/Connected";
import Docs from "./pages/Docs";
import Privacy from "./pages/Legal/Privacy";
import Terms from "./pages/Legal/Terms";
import License from "./pages/Legal/License";
import Invite from "./pages/Invite";
import { marketingCopy } from "./content/marketing_copy";
import { isDocsHost, siteLink } from "./lib/site";

function toDocs(path: string) {
  const target = siteLink(path);
  return redirect("path" in target ? target.path : target.href);
}

const notFound: RouteObject = {
  path: "*",
  element: <NotFound />,
  handle: {
    title: "Page not found | Misty",
    description: "The requested Misty page could not be found.",
  },
};

const docsHandle = {
  title: "Docs | Misty",
  description: marketingCopy.metadata.docs,
};

const docsSite: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "docs/*",
        loader: ({ request }) => toDocs(new URL(request.url).pathname),
      },
      { index: true, element: <Docs />, handle: docsHandle },
      { path: "*", element: <Docs />, handle: docsHandle },
    ],
  },
];

const site: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
        handle: {
          title: "Misty | Build together with AI",
          description: marketingCopy.metadata.home,
        },
      },
      {
        path: "settings",
        element: <Settings />,
        handle: {
          title: "Account settings | Misty",
          description: "Manage your Misty account and privacy settings.",
        },
      },
      {
        path: "settings/:tab",
        element: <Settings />,
        handle: {
          title: "Account settings | Misty",
          description: "Manage your Misty account and privacy settings.",
        },
      },
      {
        path: "download",
        element: <Download />,
        handle: {
          title: "Download Misty | macOS and Windows beta",
          description: marketingCopy.metadata.download,
        },
      },
      {
        path: "kiri",
        loader: () => redirect("/"),
      },
      {
        path: "docs/*",
        loader: ({ request }) => {
          const url = new URL(request.url);
          return toDocs(url.pathname + url.search);
        },
      },
      {
        path: "self-hosting",
        loader: () => toDocs("/docs/self-hosting"),
      },
      {
        path: "pricing",
        element: <Pricing />,
        handle: {
          title: "Pricing | Misty",
          description: marketingCopy.metadata.pricing,
        },
      },
      {
        path: "cloud",
        loader: () => redirect("/pricing"),
      },
      {
        path: "connected",
        element: <Connected />,
        handle: {
          title: "You're connected | Misty",
          description: "The app is connected. Go back to Misty to use it.",
        },
      },
      {
        path: "cloud/welcome",
        element: <CloudWelcome />,
        handle: {
          title: "Thanks for subscribing | Misty",
          description:
            "Download Misty, choose Misty Cloud and sign in with your Misty account.",
        },
      },
      {
        path: "setup",
        element: <Setup />,
        handle: {
          title: "Set up Misty | Misty",
          description:
            "Open Misty with the server and setup key from your setup email.",
        },
      },
      {
        path: "changelog",
        element: <Changelog />,
        handle: {
          title: "Changelog | Misty beta updates",
          description: marketingCopy.metadata.changelog,
        },
      },
      {
        path: "blog",
        element: <Blog />,
        handle: {
          title: "Blog | Notes from Misty",
          description: marketingCopy.metadata.blog,
        },
      },
      {
        path: "roadmap",
        element: <Roadmap />,
        handle: {
          title: "Roadmap | What Misty is building",
          description: marketingCopy.metadata.roadmap,
        },
      },
      {
        path: "privacy",
        element: <Privacy />,
        handle: {
          title: "Privacy policy | Misty",
          description:
            "How Misty handles your account details, files, and space content.",
        },
      },
      {
        path: "terms",
        element: <Terms />,
        handle: {
          title: "Terms of service | Misty",
          description:
            "The agreement covering your use of Misty and Misty Cloud.",
        },
      },
      {
        path: "license",
        element: <License />,
        handle: {
          title: "License | Misty",
          description: "Misty is free software under the GNU AGPL-3.0.",
        },
      },
      {
        path: "waitlist",
        loader: () => redirect("/download"),
      },
      {
        path: "signin",
        element: <SignIn />,
        handle: {
          title: "Sign in | Misty",
          description: "Sign in to your Misty account.",
        },
      },
      {
        path: "register",
        element: <Register />,
        handle: {
          title: "Create an account | Misty",
          description: "Sign up to get started with Misty.",
        },
      },
      {
        path: "r/:code",
        element: <Invite />,
        handle: {
          title: "You're invited | Misty",
          description: "A friend invited you to Misty, a shared workspace for people and their AI agents.",
        },
      },
      {
        path: "confirm-email",
        element: <ConfirmEmail />,
        handle: {
          title: "Confirm your email | Misty",
          description: "Confirm your email to finish creating your Misty account.",
        },
      },
      {
        path: "continue",
        element: <ContinueFromApp />,
        handle: {
          title: "Continue from Misty | Misty",
          description: "Continue from the Misty app, signed in to the same account.",
        },
      },
      {
        path: "sign-in",
        element: <SignInLink />,
        handle: {
          title: "Get a sign-in link | Misty",
          description:
            "Get a sign-in link for your Misty Cloud account. It also lets you choose a new password.",
        },
      },
      notFound,
    ],
  },
];

export const router = createBrowserRouter(isDocsHost() ? docsSite : site);
