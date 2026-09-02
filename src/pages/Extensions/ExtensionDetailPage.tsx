import { ArrowLeft, ArrowUpRight, Check, Download } from "lucide-react";
import { NavLink, useParams } from "react-router";

import { PublicPage } from "@/components/marketing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExtensionArtwork,
  ExtensionVerifiedBadge,
} from "@/generated/extensions/react";
import { extensionToolName } from "@/generated/extensions/catalog";
import NotFound from "@/pages/NotFound";
import { extensionFromSlug, extensionPlatformFamilies } from "./data";

export function ExtensionDetailPage() {
  const { extensionId } = useParams();
  const extension = extensionFromSlug(extensionId);

  if (!extension) return <NotFound />;

  const platforms = extensionPlatformFamilies(extension);

  return (
    <PublicPage className="pb-28">
      <NavLink
        className="inline-flex items-center gap-2 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        to="/extensions"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        All extensions
      </NavLink>

      <header className="mt-10 grid gap-10 border-b border-border pb-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end">
        <div>
          <div className="flex items-center gap-4">
            <ExtensionArtwork
              name={extension.name}
              size="large"
              src={extension.logoUrl}
            />
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl">
                {extension.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline">v{extension.version}</Badge>
                {extension.verified ? (
                  <ExtensionVerifiedBadge className="text-muted-foreground">
                    Verified by Misty
                  </ExtensionVerifiedBadge>
                ) : null}
              </div>
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-muted-foreground">
            {extension.overview}
          </p>
        </div>

        <div className="border-l border-border pl-6">
          <Button asChild className="h-11 w-full" size="lg">
            <NavLink to="/download">
              <Download aria-hidden="true" />
              Download Misty
            </NavLink>
          </Button>
          <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
            Install this extension from the Store inside Misty.
          </p>
        </div>
      </header>

      <div className="grid gap-14 pt-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-20">
        <div className="grid gap-14">
          <DetailSection title="What it adds">
            <ul className="grid gap-4">
              {extension.capabilities.map((capability) => (
                <li
                  className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3"
                  key={capability}
                >
                  <Check
                    aria-hidden="true"
                    className="mt-0.5 size-4 text-foreground"
                  />
                  <span className="text-sm leading-6 text-muted-foreground">
                    {capability}
                  </span>
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="Access it requests">
            <ul className="divide-y divide-border border-y border-border">
              {extension.permissions.map((permission) => (
                <li
                  className="py-4 text-sm leading-6 text-muted-foreground"
                  key={permission}
                >
                  {permission}
                </li>
              ))}
            </ul>
          </DetailSection>
        </div>

        <aside className="grid content-start gap-10">
          <DetailSection title="Get started">
            <ol className="grid gap-5">
              {extension.gettingStarted.map((step, index) => (
                <li
                  className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3"
                  key={step}
                >
                  <span className="grid size-7 place-items-center rounded-full bg-muted text-xs font-medium text-foreground">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-sm leading-6 text-muted-foreground">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </DetailSection>

          <DetailSection title="Available on">
            <p className="text-sm leading-6 text-muted-foreground">
              {platforms.join(", ")}
            </p>
          </DetailSection>

          {extension.whereItAppears.length ? (
            <DetailSection title="Where it appears">
              <p className="text-sm leading-6 text-muted-foreground">
                {extension.whereItAppears.join(", ")}
              </p>
            </DetailSection>
          ) : null}

          {extension.includedTools.length ? (
            <DetailSection title="Included tools">
              <p className="text-sm leading-6 text-muted-foreground">
                {extension.includedTools.map(extensionToolName).join(", ")}
              </p>
            </DetailSection>
          ) : null}

          {extension.links.length ? (
            <DetailSection title="Links">
              <div className="grid gap-2">
                {extension.links.map((link) => (
                  <a
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={link.url}
                    key={link.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {link.label}
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  </a>
                ))}
              </div>
            </DetailSection>
          ) : null}
        </aside>
      </div>
    </PublicPage>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-5 text-lg font-medium tracking-[-0.02em] text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}
