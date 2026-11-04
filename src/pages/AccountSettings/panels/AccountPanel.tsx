import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { updateUsername, type MeResponse } from "../api";
import { AvatarUpload } from "./components/AvatarUpload";
import { DangerZone } from "./components/DangerZone";
import { InviteLink } from "./components/InviteLink";
import { SaveFeedback } from "../components/SaveFeedback";
import {
  customRowClass,
  GhostRow,
  Row,
  Section,
} from "../components/SettingsRows";
import { useSave } from "../useSave";

export function AccountPanel({
  me,
  onUpdated,
  onAvatarUploaded,
  onDeleted,
}: {
  me: MeResponse;
  onUpdated: (username: string) => void;
  onAvatarUploaded: () => void;
  onDeleted: () => void;
}) {
  const [username, setUsername] = useState(me.username);
  const { saving, error, ok, save } = useSave(async () => {
    const saved = await updateUsername(username.trim());
    setUsername(saved);
    onUpdated(saved);
  });
  const joined = new Date(me.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <Section title="Details">
        <div className={`${customRowClass} flex flex-col gap-4 py-5`}>
          <AvatarUpload me={me} onUploaded={onAvatarUploaded} />

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <label
                htmlFor="account-username"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Username
              </label>
              <Input
                id="account-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 max-[520px]:flex-col max-[520px]:items-stretch">
              <Button
                type="button"
                onClick={save}
                disabled={
                  saving || username.trim() === "" || username.trim() === me.username
                }
                aria-busy={saving}
              >
                {saving ? <Spinner aria-hidden="true" /> : null}
                {saving ? "Saving…" : "Save changes"}
              </Button>
              <SaveFeedback ok={ok} error={error} />
            </div>
          </div>

          <div>
            <label
              htmlFor="account-email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <Input
              id="account-email"
              type="email"
              value={me.email}
              disabled
              aria-describedby="account-email-description"
            />
            <p
              id="account-email-description"
              className="mt-1 text-sm text-muted-foreground"
            >
              Email cannot be changed.
            </p>
          </div>
        </div>

        <Row label="Member since">{joined}</Row>
        <Row label="User id">
          <span className="font-mono text-sm text-muted-foreground">
            {me.id}
          </span>
        </Row>
      </Section>

      <Section title="Invites">
        <InviteLink />
      </Section>

      <Section title="Security">
        {me.provider === "misty" ? (
          <Row label="Password">
            <Button asChild variant="link" className="h-auto p-0">
              <a href="/sign-in">Forgot your password?</a>
            </Button>
          </Row>
        ) : null}
        <GhostRow label="Two-factor authentication" value="Coming soon" />
      </Section>

      <Section title="Danger">
        <DangerZone onDeleted={onDeleted} />
      </Section>
    </div>
  );
}
