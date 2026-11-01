import { createBrowserRouter, redirect } from "react-router";
import App from "./App";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import SignInLink from "./pages/SignInLink";
import NotFound from "./pages/NotFound";
import Waitlist from "./pages/Waitlist";
import Settings from "./pages/AccountSettings";
import Changelog from "./pages/Changelog";
import Blog from "./pages/Blog";
import Roadmap from "./pages/Roadmap";
import Kiri from "./pages/Kiri";
import Pricing from "./pages/Pricing";
import Setup from "./pages/Setup";
import CloudWelcome from "./pages/CloudWelcome";
import { docsRoutes } from "./pages/Docs/routes";
import Privacy from "./pages/Legal/Privacy";
import Terms from "./pages/Legal/Terms";
import License from "./pages/Legal/License";
import Invite from "./pages/Invite";
import { marketingCopy } from "./content/marketingCopy";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
        handle: {
          title: "Misty | The agentic browser workspace",
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
        path: "kiri",
        element: <Kiri />,
        handle: {
          title: "Kiri | How Misty runs Chrome and Firefox extensions",
          description: marketingCopy.metadata.kiri,
        },
      },
      docsRoutes,
      {
        // The self-hosting page moved into the docs.
        path: "self-hosting",
        loader: () => redirect("/docs/self-hosting"),
      },
      {
        path: "pricing",
        element: <Pricing />,
        handle: {
          title: "Pricing | Misty and Misty Cloud",
          description: marketingCopy.metadata.pricing,
        },
      },
      {
        path: "cloud",
        loader: () => redirect("/pricing"),
      },
      {
        // Stripe Checkout's success URL.
        path: "cloud/welcome",
        element: <CloudWelcome />,
        handle: {
          title: "Welcome to Misty Cloud | Misty",
          description:
            "Your Misty Cloud setup email is on its way. Download Misty and open its setup link.",
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
          title: "Privacy Policy | Misty",
          description:
            "How Misty handles your account details, files, and Space content.",
        },
      },
      {
        path: "terms",
        element: <Terms />,
        handle: {
          title: "Terms of Service | Misty",
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
        element: <Waitlist />,
        handle: {
          title: "Join Misty | Misty",
          description: marketingCopy.metadata.waitlist,
        },
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
          description: "A friend invited you to Misty, the free, open-source agentic browser.",
        },
      },
      {
        // misty-billing sends visitors back here with ?sent=1.
        path: "sign-in",
        element: <SignInLink />,
        handle: {
          title: "Get a sign-in link | Misty",
          description:
            "Get a sign-in link for your Misty Cloud account. It also lets you choose a new password.",
        },
      },
      {
        path: "*",
        element: <NotFound />,
        handle: {
          title: "Page not found | Misty",
          description: "The requested Misty page could not be found.",
        },
      },
    ],
  },
]);
