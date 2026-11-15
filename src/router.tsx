import { createBrowserRouter, redirect, type RouteObject } from "react-router";
import App from "./App";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import ConfirmEmail from "./pages/ConfirmEmail";
import SignInLink from "./pages/SignInLink";
import NotFound from "./pages/NotFound";
import Settings from "./pages/AccountSettings";
import Changelog from "./pages/Changelog";
import Blog from "./pages/Blog";
import Roadmap from "./pages/Roadmap";
import Pricing from "./pages/Pricing";
import Setup from "./pages/Setup";
import CloudWelcome from "./pages/CloudWelcome";
import Connected from "./pages/Connected";
import { docsRoutes } from "./pages/Docs/routes";
import Privacy from "./pages/Legal/Privacy";
import Terms from "./pages/Legal/Terms";
import License from "./pages/Legal/License";
import Invite from "./pages/Invite";
import { marketingCopy } from "./content/marketingCopy";
import { isDocsHost, siteLink } from "./lib/site";

/** Sends a `/docs/...` address to the docs host (or, there, to its own path). */
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

/** docs.mistysys.com: the docs at the root, under the site's own header and footer. */
const docsSite: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { ...docsRoutes, path: undefined },
      {
        // Older links that still name the docs folder.
        path: "docs/*",
        loader: ({ request }) => toDocs(new URL(request.url).pathname),
      },
      notFound,
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
        // Addressable tabs, so the desktop app can hand off straight to a tab
        // and a reload or share keeps you where you were.
        path: "settings/:tab",
        element: <Settings />,
        handle: {
          title: "Account settings | Misty",
          description: "Manage your Misty account and privacy settings.",
        },
      },
      {
        path: "download",
        // The homepage, scrolled to this section.
        element: <Home />,
        handle: {
          title: "Download Misty | macOS and Windows beta",
          description: marketingCopy.metadata.download,
        },
      },
      {
        // The Kiri page is gone; old links land on the homepage.
        path: "kiri",
        loader: () => redirect("/"),
      },
      {
        // The docs moved to their own host.
        path: "docs/*",
        loader: ({ request }) => {
          const url = new URL(request.url);
          return toDocs(url.pathname + url.search);
        },
      },
      {
        // The self-hosting page moved into the docs.
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
        // Where the desktop app sends the browser after an app's direct sign-in, on Misty Cloud.
        path: "connected",
        element: <Connected />,
        handle: {
          title: "You're connected | Misty",
          description: "The app is connected. Go back to Misty to use it.",
        },
      },
      {
        // Stripe Checkout's success URL.
        path: "cloud/welcome",
        element: <CloudWelcome />,
        handle: {
          title: "Welcome to Pro | Misty",
          description:
            "Download Misty, choose Misty Cloud and sign in with your Misty account.",
        },
      },
      {
        // Setup emails link here with the server and key in the fragment.
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
            "How Misty handles your account details, files, and Space content.",
        },
      },
      {
        path: "terms",
        element: <Terms />,
        handle: {
          title: "Terms of service | Misty",
          description:
            "The agreement covering your use of Misty and Pro.",
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
        // The waitlist is gone; old links go to the download.
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
        // Confirmation emails link here with the server and token in the fragment, and
        // the server sends the person back with ?result=.
        path: "confirm-email",
        element: <ConfirmEmail />,
        handle: {
          title: "Confirm your email | Misty",
          description: "Confirm your email to finish creating your Misty account.",
        },
      },
      {
        // misty-cloud sends visitors back here with ?sent=1.
        path: "sign-in",
        element: <SignInLink />,
        handle: {
          title: "Get a sign-in link | Misty",
          description:
            "Get a sign-in link for your Pro account. It also lets you choose a new password.",
        },
      },
      notFound,
    ],
  },
];

export const router = createBrowserRouter(isDocsHost() ? docsSite : site);
