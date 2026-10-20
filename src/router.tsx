import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Waitlist from "./pages/Waitlist";
import Settings from "./pages/AccountSettings";
import Changelog from "./pages/Changelog";
import Blog from "./pages/Blog";
import Roadmap from "./pages/Roadmap";
import Kiri from "./pages/Kiri";
import Privacy from "./pages/Legal/Privacy";
import Terms from "./pages/Legal/Terms";
import License from "./pages/Legal/License";
import Refunds from "./pages/Legal/Refunds";
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
          description: "Manage your Misty account, usage, and billing.",
        },
      },
      {
        // Addressable tabs, so the desktop app can hand off straight to billing
        // and a reload or share keeps you where you were.
        path: "settings/:tab",
        element: <Settings />,
        handle: {
          title: "Account settings | Misty",
          description: "Manage your Misty account, usage, and billing.",
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
      {
        path: "pricing",
        element: <Pricing />,
        handle: {
          title: "Pricing | Misty plans from free to Ultra+",
          description: marketingCopy.metadata.pricing,
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
            "The agreement covering your use of Misty and its hosted services.",
        },
      },
      {
        path: "refunds",
        element: <Refunds />,
        handle: {
          title: "Refund & Cancellation Policy | Misty",
          description:
            "How to cancel a Misty subscription and when we give refunds.",
        },
      },
      {
        path: "license",
        element: <License />,
        handle: {
          title: "License Agreement | Misty",
          description: "The license covering the Misty desktop application.",
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
          description: "A friend invited you to Misty, free with every feature.",
        },
      },
      {
        path: "reset",
        element: <ResetPassword />,
        handle: {
          title: "Reset your password | Misty",
          description: "Reset your Misty account password.",
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
