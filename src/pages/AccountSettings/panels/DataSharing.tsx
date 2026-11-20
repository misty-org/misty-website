import { useEffect, useState } from "react";

import { FieldError, SkeletonList, Switch } from "@misty/ui";

import { DesktopSettingsRow } from "@/components/settings";
import {
  fetchAccountSettings,
  updateAccountSettings,
  type AccountSettingsResponse,
} from "../api";
import { ErrorRow } from "../components/SettingsRows";

const PREFERENCES: {
  key: keyof AccountSettingsResponse;
  label: string;
  description: string;
}[] = [
  {
    key: "email_updates_enabled",
    label: "Product update emails",
    description:
      "Occasional notes about new features. Security email is always sent.",
  },
  {
    key: "analytics_enabled",
    label: "Anonymous usage analytics",
    description:
      "Aggregate feature usage only — never file names or file contents.",
  },
  {
    key: "error_reporting_enabled",
    label: "Anonymous crash reports",
    description: "Stack traces when something fails, so we can fix it.",
  },
];

/** The three server-backed account preferences. */
export function DataSharing() {
  const [settings, setSettings] = useState<AccountSettingsResponse | null>(null);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    void fetchAccountSettings()
      .then((loaded) => {
        if (active) setSettings(loaded);
      })
      .catch((error) => {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load your preferences.",
        );
      });
    return () => {
      active = false;
    };
  }, []);

  async function toggle(key: keyof AccountSettingsResponse, value: boolean) {
    if (!settings) return;
    const previous = settings;
    // The endpoint decodes into plain booleans, so anything omitted is written
    // as false. Always send the whole object, never just the changed key.
    const next = { ...settings, [key]: value };
    setSettings(next);
    setSaving(true);
    setSaveError("");
    try {
      await updateAccountSettings(next);
    } catch (error) {
      setSettings(previous);
      setSaveError(
        error instanceof Error
          ? error.message
          : "Could not save your preferences.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return <ErrorRow title="Preferences are unavailable" message={loadError} />;
  }

  if (!settings) {
    return (
      <SkeletonList
        label="Preferences"
        variant="settings"
        rows={PREFERENCES.length}
        lines={2}
        trailing="switch"
        rowClassName="px-5"
      />
    );
  }

  return (
    <>
      {PREFERENCES.map((preference) => (
        <DesktopSettingsRow
          key={preference.key}
          label={preference.label}
          description={preference.description}
        >
          <Switch
            checked={settings[preference.key]}
            disabled={saving}
            aria-label={preference.label}
            onCheckedChange={(value) => void toggle(preference.key, value)}
          />
        </DesktopSettingsRow>
      ))}
      {saveError ? (
        <FieldError message={<span role="status">{saveError}</span>} className="px-5 pb-3" />
      ) : null}
    </>
  );
}
