import type { ComponentType, SVGProps } from "react";

import paths from "./socialMarks.json";

export type MarkIcon = ComponentType<SVGProps<SVGSVGElement>>;

/** Monochrome brand marks, from Simple Icons (CC0). Lucide has no brands. */
function mark(d: string): MarkIcon {
  return function Mark(props) {
    return (
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
        <path d={d} />
      </svg>
    );
  };
}

export const GithubMark = mark(paths.GithubMark);
export const XMark = mark(paths.XMark);
export const DiscordMark = mark(paths.DiscordMark);
export const YoutubeMark = mark(paths.YoutubeMark);
export const InstagramMark = mark(paths.InstagramMark);
export const AppleMark = mark(paths.AppleMark);
export const WindowsMark = mark(paths.WindowsMark);
