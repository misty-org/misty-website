import { ChevronDown, Download as DownloadIcon } from "lucide-react";

import { PublicPage } from "@/components/marketing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { AppleMark, GithubMark, LinuxMark, WindowsMark, type MarkIcon } from "@/components/ui/SocialMarks";
import { RELEASES_URL } from "@/lib/site";
import { useReleases, type PlatformName, type Release } from "./releases";

const PLATFORMS: { name: PlatformName; icon: MarkIcon; supported: boolean }[] = [
  { name: "macOS", icon: AppleMark, supported: true },
  { name: "Windows", icon: WindowsMark, supported: false },
  { name: "Linux", icon: LinuxMark, supported: false },
];

const releaseDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });

const badgeClass = "rounded-md border border-border px-2 py-0.5 text-xs font-normal text-muted-foreground";

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
      <h3 className="flex items-center gap-2 px-2 text-base font-medium text-foreground">
        <Icon aria-hidden="true" className="size-4" />
        {name}
      </h3>
      {builds.length > 0 ? (
        <ul className="mt-3 grid">
          {builds.map((build) => (
            <li key={build.href} className="not-last:border-b not-last:border-border">
              <a
                href={build.href}
                aria-label={`Download Misty ${release!.version} for ${name}${build.architecture ? `, ${build.architecture}` : ""} (${build.packageType})`}
                className="flex items-center gap-3 rounded-md px-2 py-3 text-sm text-foreground outline-none transition-colors hover:bg-control-hover focus-visible:bg-control-hover"
              >
                <span className="min-w-0 flex-1 truncate">{build.architecture || name}</span>
                <span className="text-muted-foreground">
                  {build.packageType} · {build.size}
                </span>
                <DownloadIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 px-2 py-3 text-sm text-muted-foreground">
          {supported && release ? "Not in this release" : "Coming soon"}
        </p>
      )}
    </section>
  );
}

/** GitHub's rendered notes, set in the site's type. */
const notesClass =
  "text-base leading-7 text-muted-foreground [&>:first-child]:mt-0 [&_p]:mt-3 [&_h1]:mt-6 [&_h1]:text-lg [&_h1]:font-medium [&_h1]:text-foreground [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-foreground [&_h3]:mt-5 [&_h3]:font-medium [&_h3]:text-foreground [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:text-sm [&_img]:rounded-lg [&_img]:border [&_img]:border-border";

/** A release's notes, folded under its downloads; without notes, its page on GitHub. */
function ReleaseNotes({ release }: { release: Release }) {
  if (!release.notesHtml) {
    return (
      <a
        href={release.notesUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex text-sm text-foreground underline underline-offset-4"
      >
        View on GitHub
      </a>
    );
  }
  return (
    <Collapsible className="mt-5">
      <CollapsibleTrigger className="group/notes inline-flex items-center gap-1.5 rounded-md text-sm text-foreground outline-none hover:underline hover:underline-offset-4 focus-visible:underline">
        Release notes
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-muted-foreground transition-transform group-data-[state=open]/notes:rotate-180"
        />
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
        <Accordion type="multiple" defaultValue={["none"]}>
          <AccordionItem value="none" className="border-border">
            <AccordionTrigger className="items-center gap-3 py-5 hover:no-underline">
              <span className="flex-1 text-xl font-medium text-muted-foreground">No releases yet</span>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="grid gap-4 md:grid-cols-3">
                {PLATFORMS.map((platform) => (
                  <PlatformCard key={platform.name} platform={platform} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : releases.status === "failed" ? (
        <div className="flex justify-center pt-5">
          <Button asChild variant="outline" size="lg">
            <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer">
              <GithubMark aria-hidden="true" />
              Releases on GitHub
            </a>
          </Button>
        </div>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={[releases.latest.version]}
        >
          {releases.releases.map((release) => (
            <AccordionItem key={release.version} value={release.version} className="border-border">
              <AccordionTrigger className="items-center gap-3 py-5 hover:no-underline">
                <span className="flex flex-1 items-center gap-3">
                  <span className="text-xl font-medium text-foreground">{release.version}</span>
                  {release === releases.latest ? <span className={badgeClass}>Latest</span> : null}
                  {release.prerelease ? <span className={badgeClass}>Pre-release</span> : null}
                  {release.publishedAt ? (
                    <span className="ml-auto text-sm font-normal text-muted-foreground">
                      {releaseDate.format(release.publishedAt)}
                    </span>
                  ) : null}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {PLATFORMS.map((platform) => (
                    <PlatformCard key={platform.name} platform={platform} release={release} />
                  ))}
                </div>
                <ReleaseNotes release={release} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </PublicPage>
  );
}
