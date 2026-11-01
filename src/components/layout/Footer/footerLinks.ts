import type { IconType } from "react-icons";
import {
  FaDiscord,
  FaGithub,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { RELEASES_URL, REPO_URL } from "@/lib/site";

export interface FooterColumn {
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
      { to: "/kiri", text: "Kiri" },
      { to: REPO_URL, text: "GitHub", external: true },
      { to: RELEASES_URL, text: "Releases", external: true },
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
  icon: IconType;
  placeholder?: boolean;
}[] = [
  {
    label: "GitHub",
    href: REPO_URL,
    icon: FaGithub,
  },
  { label: "X.com", href: "#", icon: FaXTwitter, placeholder: true },
  { label: "Discord", href: "#", icon: FaDiscord, placeholder: true },
  { label: "YouTube", href: "#", icon: FaYoutube, placeholder: true },
  { label: "Instagram", href: "#", icon: FaInstagram, placeholder: true },
];
