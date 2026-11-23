import { useEffect, useRef, useState } from "react";
import {
  type Location,
  Outlet,
  useLocation,
  useMatches,
  ScrollRestoration,
  useNavigate,
} from "react-router";
import { AuthProvider } from "./AuthContext";
import Navbar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";
import { AccountSettingsDialog } from "./pages/AccountSettings";
import {
  isSettingsPathname,
  settingsPathForTab,
  settingsTabFromPathname,
} from "./pages/AccountSettings/settings_route";
import { TABS } from "./pages/AccountSettings/tabs";
import { DOCS_URL, isDocsHost, isDocsPath, SITE_URL } from "./lib/site";
import { isHomePath } from "./pages/Home/use_section_route";

type Handle = { title?: string; description?: string };

const scrollKey = (location: Location) => {
  if (isHomePath(location.pathname)) return "home";
  return location.key === "default" ? location.pathname : location.key;
};
const SCROLL_STORAGE_KEY = "misty-scroll-positions";

const pageKey = (pathname: string) => {
  if (isHomePath(pathname)) return "/";
  return isDocsHost() || isDocsPath(pathname) ? "/docs" : pathname;
};

function forgetScrollPosition(key: string) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SCROLL_STORAGE_KEY) ?? "{}");
    delete saved[key];
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(saved));
  } catch {
    return;
  }
}

if (typeof window !== "undefined") {
  const { pathname, hash } = window.location;
  if (pathname !== "/" && isHomePath(pathname)) forgetScrollPosition("home");
  else if (!isHomePath(pathname) && hash && !hash.startsWith("#/")) forgetScrollPosition(pathname);
}

function setMeta(
  selector: string,
  attribute: "name" | "property",
  key: string,
  content: string,
) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export default function App() {
  const matches = useMatches();
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const previousPathRef = useRef(location.pathname);

  const onSettingsRoute = isSettingsPathname(location.pathname);
  const routeTab = settingsTabFromPathname(location.pathname);

  useEffect(() => {
    const match = [...matches]
      .reverse()
      .find((routeMatch) => Boolean(routeMatch.handle as Handle | undefined));
    const handle = match?.handle as Handle | undefined;
    const title = handle?.title ?? "Misty | Build together with AI";
    const description =
      handle?.description ??
      "A collaborative environment where people and their agents learn, work and create together. Bring any engine, build in spaces you share, and explore what others have made.";
    const canonicalUrl = new URL(
      location.pathname,
      isDocsHost() ? DOCS_URL : SITE_URL,
    ).toString();

    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description,
    );

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [location.pathname, matches]);

  useEffect(() => {
    if (!/^#[A-Za-z][\w-]*$/.test(location.hash)) return;

    const frame = window.requestAnimationFrame(() => {
      const target = document.querySelector(location.hash);
      target?.scrollIntoView({ block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const previousPath = previousPathRef.current;
    previousPathRef.current = location.pathname;

    if (previousPath === location.pathname || onSettingsRoute) return;
    if (isHomePath(previousPath) && isHomePath(location.pathname)) return;

    const frame = window.requestAnimationFrame(() => {
      const heading = mainRef.current?.querySelector<HTMLElement>("h1");
      if (!heading) return;
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, onSettingsRoute]);

  useEffect(() => {
    const { hash } = window.location;
    if (!hash.startsWith("#/")) {
      return;
    }

    navigate(hash.slice(1), { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!onSettingsRoute || routeTab !== null) return;

    navigate(settingsPathForTab(TABS[0].id), { replace: true });
  }, [onSettingsRoute, routeTab, navigate]);

  function handleSettingsOpenChange(next: boolean) {
    if (next) {
      setSettingsOpen(true);
      return;
    }
    setSettingsOpen(false);
    if (onSettingsRoute) navigate("/", { replace: true });
  }

  return (
    <AuthProvider>
      <ScrollRestoration getKey={scrollKey} storageKey={SCROLL_STORAGE_KEY} />

      <div className="relative flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-md bg-background px-4 py-2 text-control font-medium text-foreground focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-ring"
          onClick={() => mainRef.current?.focus()}
        >
          Skip to content
        </a>
        <Navbar onOpenSettings={() => setSettingsOpen(true)} />

        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="relative z-10 min-h-[100svh] w-full min-w-0 flex-1 outline-none"
        >
          <div
            key={pageKey(location.pathname)}
            data-page-transition={location.pathname}
            className="page-transition w-full min-w-0"
          >
            <Outlet />
          </div>
        </main>

        {!isHomePath(location.pathname) && <Footer />}
        <AccountSettingsDialog
          open={settingsOpen || routeTab !== null}
          onOpenChange={handleSettingsOpenChange}
          tab={routeTab ?? undefined}
          onTabChange={
            routeTab !== null
              ? (tab) => navigate(settingsPathForTab(tab), { replace: true })
              : undefined
          }
        />
      </div>
    </AuthProvider>
  );
}
