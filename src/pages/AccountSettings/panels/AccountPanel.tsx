import { useState } from "react";

import { Button, Field, InlineLink, Input, Text } from "@misty/ui";

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
            <Field label="Username">
              <Input
                id="account-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Field>
            <div className="flex items-center gap-3 max-[572px]:flex-col max-[572px]:items-stretch">
              <Button
                variant="primary"
                onClick={save}
                disabled={
                  saving || username.trim() === "" || username.trim() === me.username
                }
                aria-busy={saving}
              >
                Save changes
              </Button>
              <SaveFeedback ok={ok} error={error} />
            </div>
          </div>

          <div className="grid gap-1">
            <Field label="Email">
              <Input
                id="account-email"
                type="email"
                value={me.email}
                disabled
                aria-describedby="account-email-description"
              />
            </Field>
            <Text wrap size="meta" tone="muted" id="account-email-description">
              Email cannot be changed.
            </Text>
          </div>
        </div>

        <Row label="Member since">{joined}</Row>
        <Row label="User id">
          <Text bare size="control" tone="muted">
            {me.id}
          </Text>
        </Row>
      </Section>

      <Section title="Invites">
        <InviteLink />
      </Section>

      <Section title="Security">
        {me.provider === "misty" ? (
          <Row label="Password">
            <InlineLink asChild>
              <a href="/sign-in">Forgot your password?</a>
            </InlineLink>
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
