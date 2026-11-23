import { useEffect, useState } from "react";

import { REPO_URL } from "@/lib/site";

export type PlatformName = "macOS" | "Windows" | "Linux";

export type ReleaseBuild = {
  platform: PlatformName;
  architecture: string;
  packageType: string;
  size: string;
  href: string;
};

export type Release = {
  version: string;
  publishedAt: Date | null;
  prerelease: boolean;
  notesUrl: string;
  notesHtml: string;
  builds: ReleaseBuild[];
};

type GithubAsset = { name: string; size: number; browser_download_url: string };
type GithubRelease = {
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string | null;
  prerelease: boolean;
  draft: boolean;
  body_html?: string;
  assets: GithubAsset[];
};

const RELEASES_API = `${REPO_URL.replace("https://github.com/", "https://api.github.com/repos/")}/releases?per_page=30`;

const INSTALLER = /\.(dmg|pkg|exe|msi|zip|appimage|deb|rpm)$/i;
const UPDATER_ONLY = /\.(app\.tar\.gz|nsis\.zip|msi\.zip)$/i;

function platformOf(name: string): PlatformName | undefined {
  if (/\.(dmg|pkg)$/i.test(name) || /mac|darwin|osx|apple/i.test(name)) return "macOS";
  if (/\.(exe|msi)$/i.test(name) || /win/i.test(name)) return "Windows";
  if (/\.(appimage|deb|rpm)$/i.test(name) || /linux/i.test(name)) return "Linux";
  return undefined;
}

function architectureOf(name: string, platform: PlatformName): string {
  if (/universal/i.test(name)) return "Universal";
  if (/arm64|aarch64/i.test(name)) return platform === "macOS" ? "Apple Silicon" : "ARM64";
  if (/x86_64|x64|amd64|intel/i.test(name)) return platform === "macOS" ? "Intel" : "x64";
  return "";
}

function packageTypeOf(name: string): string {
  const extension = name.split(".").pop()!;
  return extension.toLowerCase() === "appimage" ? "AppImage" : extension.toUpperCase();
}

function formatSize(bytes: number): string {
  const megabytes = bytes / 1_000_000;
  return megabytes >= 1 ? `${Math.round(megabytes)} MB` : `${Math.max(1, Math.round(bytes / 1000))} KB`;
}

export function toRelease(release: GithubRelease): Release {
  const builds = release.assets.flatMap((asset): ReleaseBuild[] => {
    if (!INSTALLER.test(asset.name) || UPDATER_ONLY.test(asset.name)) return [];
    const platform = platformOf(asset.name);
    if (!platform) return [];
    return [
      {
        platform,
        architecture: architectureOf(asset.name, platform),
        packageType: packageTypeOf(asset.name),
        size: formatSize(asset.size),
        href: asset.browser_download_url,
      },
    ];
  });
  return {
    version: release.tag_name.replace(/^misty-/, ""),
    publishedAt: release.published_at ? new Date(release.published_at) : null,
    prerelease: release.prerelease,
    notesUrl: release.html_url,
    notesHtml: release.body_html?.trim() ?? "",
    builds,
  };
}

let all: Promise<Release[] | null> | undefined;

function fetchReleases(): Promise<Release[] | null> {
  all ??= fetch(RELEASES_API, { headers: { Accept: "application/vnd.github.html+json" } })
    .then((response) => (response.ok ? response.json() : null))
    .then((body: GithubRelease[] | null) =>
      body ? body.filter((release) => !release.draft).map(toRelease) : null,
    )
    .catch(() => null);
  return all;
}

export type Releases =
  | { status: "loading" }
  | { status: "ready"; releases: Release[]; latest: Release }
  | { status: "none" }
  | { status: "failed" };

export function useReleases(): Releases {
  const [state, setState] = useState<Releases>({ status: "loading" });
  useEffect(() => {
    let live = true;
    void fetchReleases().then((releases) => {
      if (!live) return;
      if (!releases) return setState({ status: "failed" });
      if (!releases.length) return setState({ status: "none" });
      const latest = releases.find((release) => !release.prerelease) ?? releases[0];
      setState({ status: "ready", releases, latest });
    });
    return () => {
      live = false;
    };
  }, []);
  return state;
}
