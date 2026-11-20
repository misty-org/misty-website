import { useState } from "react";
import { AppleMark, LinuxMark, WindowsMark, type MarkIcon } from "@/components/brand/SocialMarks";

import { Button } from "@misty/ui";
import { SiteLink } from "@/components/SiteLink";
import { cn } from "@/lib/utils";
import { detectDownloadPlatform } from "@/pages/Download/detectPlatform";
import { useReleases, type PlatformName } from "@/pages/Download/releases";

const MARKS: Record<PlatformName, MarkIcon> = { macOS: AppleMark, Windows: WindowsMark, Linux: LinuxMark };
/** The desktops Misty ships for; the button names one of these even before its release has loaded. */
const SUPPORTED: readonly PlatformName[] = ["macOS"];

/**
 * The hero's primary button. On a desktop Misty ships for (or one the latest release has an installer for), it
 * names that desktop with its mark and downloads the installer, or opens the download page until there is one.
 * Everywhere else it is a plain link to the download page.
 */
export function DownloadCtaButton() {
  const [platform] = useState(detectDownloadPlatform);
  const releases = useReleases();
  const builds =
    releases.status === "ready" ? releases.latest.builds.filter((candidate) => candidate.platform === platform) : [];
  const build = builds.find((candidate) => candidate.packageType === "DMG") ?? builds[0];
  const named = platform && (build || SUPPORTED.includes(platform)) ? platform : undefined;
  const Mark = named ? MARKS[named] : null;

  return (
    <Button variant="primary" size="lg" asChild data-cta="download">
      {build ? (
        <a href={build.href} aria-label={`Download Misty for ${build.platform}`}>
          {Mark ? <Mark className="-translate-y-px" aria-hidden="true" /> : null}
          <span>Download for {build.platform}</span>
        </a>
      ) : (
        <SiteLink to="/download">
          {Mark ? <Mark className="-translate-y-px" aria-hidden="true" /> : null}
          <span>{named ? `Download for ${named}` : "Download Misty"}</span>
        </SiteLink>
      )}
    </Button>
  );
}

export function HomeCtaButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <DownloadCtaButton />
    </div>
  );
}
