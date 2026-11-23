import { lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router";
import { SetupState } from "@misty/ui";

const DocsSite = lazy(() => import("@misty/docs").then((module) => ({ default: module.DocsSite })));
const DocsNavControls = lazy(() =>
  import("@misty/docs").then((module) => ({ default: module.DocsNavControls })),
);

const componentStyles = () => import("./components.css");

const docsRoute = (pathname: string) => pathname.replace(/^\/+|\/+$/g, "");

export default function Docs() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <div className="mt-[calc(2px-1rem)]">
      <Suspense fallback={<SetupState tool="docs" />}>
        <DocsSite
          route={docsRoute(pathname)}
          onNavigate={(route) => navigate(`/${route}`)}
          top="calc(var(--site-nav-height) - 1rem + 2px)"
          bar={false}
          gutter="var(--site-gutter)"
          maxWidth="var(--site-container-max)"
          componentStyles={componentStyles}
        />
      </Suspense>
    </div>
  );
}

export function DocsNavbarControls() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <Suspense fallback={null}>
      <DocsNavControls route={docsRoute(pathname)} onNavigate={(route) => navigate(`/${route}`)} />
    </Suspense>
  );
}
