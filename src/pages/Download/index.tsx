import { Download as DownloadIcon } from "lucide-react";
import { useState } from "react";
import {
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Disclosure,
  DisclosureButton,
  DisclosureList,
  InlineLink,
  Skeleton,
  Text,
} from "@misty/ui";

import { PublicPage } from "@/components/marketing";
import { AppleMark, GithubMark, LinuxMark, WindowsMark, type MarkIcon } from "@/components/brand/SocialMarks";
import { RELEASES_URL } from "@/lib/site";
import { useReleases, type PlatformName, type Release } from "./releases";

const PLATFORMS: { name: PlatformName; icon: MarkIcon; supported: boolean }[] = [
  { name: "macOS", icon: AppleMark, supported: true },
  { name: "Windows", icon: WindowsMark, supported: false },
  { name: "Linux", icon: LinuxMark, supported: false },
];

const releaseDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });

/** One platform's installers in a release, each a row that downloads it. */
function PlatformCard({
  platform,
  release,
}: {
  platform: (typeof PLATFORMS)[number];
  /** None before the first release: every card is still to come. */
  release?: Release;
}) {
  const { name, icon: Icon, supported } = platform;
  const builds = release?.builds.filter((build) => build.platform === name) ?? [];
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <Text bare as="h3" size="page" weight="medium" className="flex items-center gap-2 px-2">
        <Icon aria-hidden="true" />
        {name}
      </Text>
      {builds.length > 0 ? (
        <ul className="mt-3 grid">
          {builds.map((build) => (
            <li key={build.href} className="not-last:border-b not-last:border-border">
              <a
                href={build.href}
                aria-label={`Download Misty ${release!.version} for ${name}${build.architecture ? `, ${build.architecture}` : ""} (${build.packageType})`}
                className="flex items-center gap-3 rounded-md px-2 py-3 text-control text-foreground outline-none transition-colors hover:bg-control-hover focus-visible:bg-control-hover"
              >
                <span className="min-w-0 flex-1 truncate">{build.architecture || name}</span>
                <span className="text-muted-foreground">
                  {build.packageType} · {build.size}
                </span>
                <DownloadIcon aria-hidden="true" className="shrink-0 text-muted-foreground" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <Text wrap size="control" tone="muted" className="mt-3 px-2 py-3">
          {supported && release ? "Not in this release" : "Coming soon"}
        </Text>
      )}
    </section>
  );
}

/** GitHub's rendered notes, set in the site's type. */
const notesClass =
  "text-page leading-7 text-muted-foreground [&>:first-child]:mt-0 [&_p]:mt-3 [&_h1]:mt-6 [&_h1]:text-title [&_h1]:font-medium [&_h1]:text-foreground [&_h2]:mt-6 [&_h2]:text-title [&_h2]:font-medium [&_h2]:text-foreground [&_h3]:mt-5 [&_h3]:font-medium [&_h3]:text-foreground [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:text-control [&_img]:rounded-lg [&_img]:border [&_img]:border-border";

/** A release's notes, folded under its downloads; without notes, its page on GitHub. */
function ReleaseNotes({ release }: { release: Release }) {
  const [open, setOpen] = useState(false);
  if (!release.notesHtml) {
    return (
      <InlineLink asChild className="mt-5 inline-flex text-control text-foreground">
        <a href={release.notesUrl} target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </InlineLink>
    );
  }
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-5">
      <CollapsibleTrigger asChild>
        <DisclosureButton open={open}>Release notes</DisclosureButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {/* GitHub renders and sanitizes the notes; they come from the app's own releases. */}
        <div className={`mt-4 max-w-3xl ${notesClass}`} dangerouslySetInnerHTML={{ __html: release.notesHtml }} />
      </CollapsibleContent>
    </Collapsible>
  );
}

/** Every release from GitHub, newest first and the latest open, each with its installers by platform. */
export default function Download() {
  const releases = useReleases();

  return (
    <PublicPage>
      <h1 className="pb-10 text-center marketing-heading text-foreground">Download</h1>

      {releases.status === "loading" ? (
        <div aria-hidden="true" className="grid gap-4 pt-5">
          <Skeleton className="h-7 w-40" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        </div>
      ) : releases.status === "none" ? (
        // The same accordion, with one open row and every platform still to come.
        <DisclosureList>
          <Disclosure title="No releases yet" defaultOpen>
            <div className="grid gap-4 md:grid-cols-3">
              {PLATFORMS.map((platform) => (
                <PlatformCard key={platform.name} platform={platform} />
              ))}
            </div>
          </Disclosure>
        </DisclosureList>
      ) : releases.status === "failed" ? (
        <div className="flex justify-center pt-5">
          <Button size="lg" asChild>
            <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer">
              <GithubMark aria-hidden="true" />
              Releases on GitHub
            </a>
          </Button>
        </div>
      ) : (
        <DisclosureList>
          {releases.releases.map((release) => (
            <Disclosure
              key={release.version}
              defaultOpen={release === releases.latest}
              title={
                <span className="flex items-center gap-3">
                  <Text bare size="title" tone="bright">
                    {release.version}
                  </Text>
                  {release === releases.latest ? <Badge variant="outline">Latest</Badge> : null}
                  {release.prerelease ? <Badge variant="outline">Pre-release</Badge> : null}
                  {release.publishedAt ? (
                    <Text bare size="control" tone="muted" className="ml-auto font-normal">
                      {releaseDate.format(release.publishedAt)}
                    </Text>
                  ) : null}
                </span>
              }
            >
              <div className="grid gap-4 md:grid-cols-3">
                {PLATFORMS.map((platform) => (
                  <PlatformCard key={platform.name} platform={platform} release={release} />
                ))}
              </div>
              <ReleaseNotes release={release} />
            </Disclosure>
          ))}
        </DisclosureList>
      )}
    </PublicPage>
  );
}
