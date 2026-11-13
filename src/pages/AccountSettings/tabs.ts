import { CreditCard, Shield, UserCircle, type LucideIcon } from "lucide-react";

export type Tab = "account" | "subscription" | "privacy";

export const TABS: readonly { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "account", label: "Profile", icon: UserCircle },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "privacy", label: "Privacy", icon: Shield },
];

export const TAB_GROUPS = [{ label: "Account", items: TABS }] as const;
