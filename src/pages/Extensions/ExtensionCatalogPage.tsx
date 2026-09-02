import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink } from "react-router";

import { PublicPage } from "@/components/marketing";
import { Input } from "@/components/ui/input";
import {
  ExtensionArtwork,
  ExtensionVerifiedBadge,
} from "@/generated/extensions/react";
import {
  extensionCatalog,
  extensionPlatformFamilies,
  extensionSlug,
  filterExtensionCatalog,
  type ExtensionCatalogEntry,
} from "./data";

export function ExtensionCatalogPage() {
  const [query, setQuery] = useState("");
  const extensions = useMemo(() => filterExtensionCatalog(query), [query]);

  return (
    <PublicPage className="pb-28">
      <header className="grid gap-10 border-b border-border pb-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
        <div className="max-w-4xl">
          <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-[5rem]">
            Extend the work already in motion.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Add focused capabilities to Misty without assembling another stack
            of apps. Every extension publishes its permissions, tools, and place
            in your workspace before you install it.
          </p>
        </div>
        <div className="border-l border-border pl-6">
          <p className="text-sm font-medium text-foreground">
            One verified catalog
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This page and the Misty Store are generated from the same extension
            manifests, so versions and capabilities stay aligned.
          </p>
        </div>
      </header>

      <div className="grid gap-12 pt-12 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="extension-search"
          >
            Find an extension
          </label>
          <div className="relative mt-3">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="h-11 pl-9"
              id="extension-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search capabilities or tools"
              type="search"
              value={query}
            />
          </div>
          <p aria-live="polite" className="mt-4 text-sm text-muted-foreground">
            {extensions.length === extensionCatalog.length
              ? `${extensionCatalog.length} available extensions`
              : `${extensions.length} matching extensions`}
          </p>
          <p className="mt-8 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
            Extensions run inside Misty and request access only when their work
            needs it.
          </p>
        </aside>

        <section aria-label="Extension catalog">
          {extensions.length ? (
            <div className="border-t border-border">
              {extensions.map((extension) => (
                <ExtensionRow extension={extension} key={extension.id} />
              ))}
            </div>
          ) : (
            <div className="border-y border-border py-16">
              <h2 className="text-xl font-medium text-foreground">
                No extension matches that search.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a capability such as backup, media, storage, or themes.
              </p>
            </div>
          )}
        </section>
      </div>
    </PublicPage>
  );
}

function ExtensionRow({ extension }: { extension: ExtensionCatalogEntry }) {
  return (
    <article className="group border-b border-border">
      <NavLink
        className="grid gap-5 py-7 outline-none transition-colors hover:bg-muted/45 focus-visible:bg-muted/45 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center sm:px-4 sm:-mx-4"
        to={`/extensions/${extensionSlug(extension.id)}`}
      >
        <ExtensionArtwork name={extension.name} src={extension.logoUrl} />
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-medium tracking-[-0.02em] text-foreground">
              {extension.name}
            </span>
            {extension.verified ? (
              <ExtensionVerifiedBadge className="text-muted-foreground" />
            ) : null}
          </span>
          <span className="mt-1.5 block max-w-2xl text-sm leading-6 text-muted-foreground">
            {extension.overview}
          </span>
          <span className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>v{extension.version}</span>
            {extensionPlatformFamilies(extension).map((platform) => (
              <span key={platform}>{platform}</span>
            ))}
          </span>
        </span>
        <span className="flex items-center gap-2 text-sm font-medium text-foreground sm:justify-self-end">
          View details
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-1 group-focus-within:translate-x-1"
          />
        </span>
      </NavLink>
    </article>
  );
}
