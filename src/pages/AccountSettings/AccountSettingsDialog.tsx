import { useRef, useState } from "react";

import { DesktopSettingsFrame } from "@/components/settings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  ErrorState,
  SkeletonList,
} from "@misty/ui";
import { AccountPanel } from "./panels/AccountPanel";
import { BoostsPanel } from "./panels/BoostsPanel";
import { PrivacyPanel } from "./panels/PrivacyPanel";
import { SubscriptionPanel } from "./panels/SubscriptionPanel";
import { TAB_GROUPS, TABS, type Tab } from "./tabs";
import { useAccountSettings } from "./useAccountSettings";

export function AccountSettingsDialog({
  open,
  onOpenChange,
  tab: controlledTab,
  onTabChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Supplied only when the dialog was opened from a settings URL. Left
   * undefined for the nav-menu overlay, which must not touch the address bar.
   */
  tab?: Tab;
  onTabChange?: (tab: Tab) => void;
}) {
  const [localTab, setLocalTab] = useState<Tab>("account");
  const dialogRef = useRef<HTMLDivElement>(null);
  const tab = controlledTab ?? localTab;

  function setTab(next: Tab) {
    setLocalTab(next);
    onTabChange?.(next);
  }
  const {
    me,
    loading,
    loadError,
    renameAccount,
    bumpAvatarVersion,
    finishDeletion,
  } = useAccountSettings({ open, onOpenChange });

  const activeTab = TABS.find((item) => item.id === tab) ?? TABS[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={dialogRef}
        size="xl"
        hideClose
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          dialogRef.current?.focus({ preventScroll: true });
        }}
        className="h-[min(47.5rem,calc(100dvh-4rem))] w-[min(61.25rem,calc(100vw-4rem))] max-w-none gap-0 overflow-hidden p-0 max-[704px]:h-[calc(100dvh-1.5rem)] max-[704px]:w-[calc(100vw-1.5rem)]"
      >
        <DialogTitle className="sr-only">Account settings</DialogTitle>
        <DialogDescription className="sr-only">
          Manage your Misty account and privacy settings.
        </DialogDescription>

        <DesktopSettingsFrame
          activeId={tab}
          ariaLabel="Account settings"
          groups={TAB_GROUPS}
          navigationLabel="Account settings sections"
          onClose={() => onOpenChange(false)}
          onSelect={setTab}
          title={activeTab.label}
        >
          {tab === "account" ? (
            me ? (
              <AccountPanel
                me={me}
                onUpdated={renameAccount}
                onAvatarUploaded={bumpAvatarVersion}
                onDeleted={finishDeletion}
              />
            ) : loading ? (
              <SkeletonList label="Account details" variant="settings" rows={3} trailing="field" />
            ) : (
              <ErrorState
                inline
                title="Account details are unavailable"
                line={loadError || "Close settings and try again in a moment."}
              />
            )
          ) : null}

          {tab === "subscription" ? (
            <SubscriptionPanel onClose={() => onOpenChange(false)} />
          ) : null}

          {tab === "boosts" ? <BoostsPanel onClose={() => onOpenChange(false)} /> : null}

          {tab === "privacy" ? <PrivacyPanel /> : null}
        </DesktopSettingsFrame>
      </DialogContent>
    </Dialog>
  );
}
