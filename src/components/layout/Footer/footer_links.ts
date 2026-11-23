import {
  DiscordMark,
  GithubMark,
  InstagramMark,
  XMark,
  YoutubeMark,
  type MarkIcon,
} from "@/components/brand/SocialMarks";

import { DISCORD_URL, RELEASES_URL, REPO_URL, SUPPORT_EMAIL } from "@/lib/site";

interface FooterColumn {
  label: string;
  links: { to: string; text: string; external?: boolean }[];
}

export const columns: FooterColumn[] = [
  {
    label: "Explore",
    links: [
      { to: "/#features", text: "Features" },
      { to: "/download", text: "Download" },
      { to: "/pricing", text: "Pricing" },
      { to: "/docs", text: "Docs" },
      { to: "/docs/self-hosting", text: "Self-hosting" },
    ],
  },
  {
    label: "Resources",
    links: [
      { to: "/blog", text: "Blog" },
      { to: "/roadmap", text: "Roadmap" },
      { to: "/changelog", text: "Changelog" },
      { to: REPO_URL, text: "GitHub", external: true },
      { to: RELEASES_URL, text: "Releases", external: true },
      { to: `mailto:${SUPPORT_EMAIL}`, text: "Support", external: true },
    ],
  },
];

export const legalLinks: { to: string; text: string }[] = [
  { to: "/privacy", text: "Privacy" },
  { to: "/terms", text: "Terms" },
  { to: "/privacy#cookies", text: "Cookies" },
  { to: "/license", text: "License" },
];

export const socialLinks: {
  label: string;
  href: string;
  icon: MarkIcon;
  placeholder?: boolean;
}[] = [
  {
    label: "GitHub",
    href: REPO_URL,
    icon: GithubMark,
  },
  { label: "X.com", href: "#", icon: XMark, placeholder: true },
  { label: "Discord", href: DISCORD_URL, icon: DiscordMark },
  { label: "YouTube", href: "#", icon: YoutubeMark, placeholder: true },
  { label: "Instagram", href: "#", icon: InstagramMark, placeholder: true },
];
