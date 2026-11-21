import { lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router";
import { SetupState } from "@misty/ui";

// The docs are misty-docs, mounted here so they sit under the site's own navbar and footer. They are
// a large bundle (every component example), so only the docs host loads them.
const DocsSite = lazy(() => import("@misty/docs").then((module) => ({ default: module.DocsSite })));
const DocsNavControls = lazy(() =>
  import("@misty/docs").then((module) => ({ default: module.DocsNavControls })),
);

const docsRoute = (pathname: string) => pathname.replace(/^\/+|\/+$/g, "");

/** The docs host's page: the address is the docs page (`/sdk/react`), under the site's navbar. */
export default function Docs() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    // The navbar reserves a little more room than it fills; the docs start closer under it.
    <div className="mt-[calc(2px-1rem)]">
      <Suspense fallback={<SetupState tool="docs" />}>
        <DocsSite
          route={docsRoute(pathname)}
          onNavigate={(route) => navigate(`/${route}`)}
          top="calc(var(--site-nav-height) - 1rem + 2px)"
          bar={false}
          gutter="var(--site-gutter)"
          maxWidth="var(--site-container-max)"
        />
      </Suspense>
    </div>
  );
}

/** The docs' switcher between App, SDK and Design, for the navbar on the docs host. */
export function DocsNavbarControls() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <Suspense fallback={null}>
      <DocsNavControls route={docsRoute(pathname)} onNavigate={(route) => navigate(`/${route}`)} />
    </Suspense>
  );
}
