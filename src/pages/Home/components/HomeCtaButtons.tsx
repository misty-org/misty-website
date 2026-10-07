import { useState } from "react";
import { FaApple, FaWindows } from "react-icons/fa";
import { NavLink } from "react-router";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { JOIN_HREF, WEB_APP_URL } from "@/lib/site";
import { currentRelease, type ReleaseBuild } from "@/pages/Download/data";
import { detectDownloadPlatform } from "@/pages/Download/detectPlatform";

function detectDownloadBuild(): ReleaseBuild | undefined {
  const platform = detectDownloadPlatform();
  return currentRelease.builds.find((build) => build.platform === platform);
}

/** The hero's primary button: the visitor's own desktop build, or the web app on phones and tablets. */
export function DownloadCtaButton({ dark = false }: { dark?: boolean }) {
  const [downloadBuild] = useState(detectDownloadBuild);

  return (
    <>
      <Button
        asChild
        size="lg"
        className={cn(
          "hidden md:inline-flex h-11 rounded-full px-6 text-sm hover:opacity-85",
          dark
            ? "bg-white text-[#09090b] hover:bg-white"
            : "bg-[var(--marketing-foreground)] text-[var(--marketing-surface)]",
        )}
      >
        {downloadBuild ? (
          <a
            href={downloadBuild.href}
            aria-label={`Download Misty for ${downloadBuild.platform}`}
          >
            {downloadBuild.platform === "macOS" ? (
              <FaApple className="-translate-y-px" aria-hidden="true" />
            ) : (
              <FaWindows className="-translate-y-px" aria-hidden="true" />
            )}
            <span>Download for {downloadBuild.platform}</span>
          </a>
        ) : (
          <NavLink to={JOIN_HREF}>Get started</NavLink>
        )}
      </Button>
      <Button asChild size="lg" className="h-11 rounded-full bg-[var(--marketing-foreground)] px-6 text-sm text-[var(--marketing-surface)] md:hidden">
        <a href={WEB_APP_URL}>Try the web app</a>
      </Button>
    </>
  );
}

export function HomeCtaButtons({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <DownloadCtaButton dark={dark} />
      <Button
        asChild
        variant="outline"
        size="lg"
        className={cn(
          "h-11 rounded-full bg-transparent px-6 text-sm",
          dark
            ? "border-white/30 text-white hover:bg-white/10 hover:text-white"
            : "border-[var(--marketing-border-strong)] text-[var(--marketing-foreground)] hover:bg-[var(--secondary)]",
        )}
      >
        <NavLink to={JOIN_HREF} data-cta="join">Join now</NavLink>
      </Button>
    </div>
  );
}
