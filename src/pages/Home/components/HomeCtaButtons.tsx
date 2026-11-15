import { useState } from "react";
import { AppleMark, WindowsMark } from "@/components/ui/SocialMarks";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RELEASES_URL } from "@/lib/site";
import { currentRelease, type ReleaseBuild } from "@/pages/Download/data";
import { detectDownloadPlatform } from "@/pages/Download/detectPlatform";

function detectDownloadBuild(): ReleaseBuild | undefined {
  const platform = detectDownloadPlatform();
  return currentRelease.builds.find((build) => build.platform === platform);
}

/** The hero's primary button: the visitor's own desktop build, or every release on other devices. */
export function DownloadCtaButton() {
  const [downloadBuild] = useState(detectDownloadBuild);

  return (
    <>
      <Button
        asChild
        size="lg"
        data-cta="download"
      >
        {downloadBuild ? (
          <a
            href={downloadBuild.href}
            aria-label={`Download Misty for ${downloadBuild.platform}`}
          >
            {downloadBuild.platform === "macOS" ? (
              <AppleMark className="-translate-y-px" aria-hidden="true" />
            ) : (
              <WindowsMark className="-translate-y-px" aria-hidden="true" />
            )}
            <span>Download for {downloadBuild.platform}</span>
          </a>
        ) : (
          <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer">
            Download Misty
          </a>
        )}
      </Button>
    </>
  );
}

export function HomeCtaButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <DownloadCtaButton />
    </div>
  );
}
