import { Lock, UserCircle, type LucideIcon } from "lucide-react";

export type Tab = "account" | "privacy";
export type TabGroup = "account" | "privacy";

const GROUP_LABELS: Record<TabGroup, string> = {
  account: "Account",
  privacy: "Privacy & legal",
};

export const TABS: readonly {
  id: Tab;
  label: string;
  icon: LucideIcon;
  group: TabGroup;
  groupLabel: string;
}[] = [
  {
    id: "account",
    label: "Account",
    icon: UserCircle,
    group: "account",
    groupLabel: GROUP_LABELS.account,
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: Lock,
    group: "privacy",
    groupLabel: GROUP_LABELS.privacy,
  },
];
