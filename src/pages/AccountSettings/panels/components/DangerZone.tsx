import { useState } from "react";

import { Button, ConfirmDeleteDialog, Field, FieldError, Input, Text } from "@misty/ui";

import {
  AccountDeletionBlockedError,
  beginAccountDeletion,
  type AccountDeletionResponse,
} from "../../api";
import { customRowClass } from "../../components/SettingsRows";

const CONFIRMATION = "DELETE";

export function DangerZone({ onDeleted }: { onDeleted: () => void }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [blockedSpaces, setBlockedSpaces] = useState<string[]>([]);
  const [result, setResult] = useState<AccountDeletionResponse | null>(null);

  const ready = password.length > 0 && confirmation === CONFIRMATION;

  async function confirmDelete() {
    if (working || !ready) return;
    setWorking(true);
    setError("");
    setBlockedSpaces([]);
    try {
      const response = await beginAccountDeletion(password, confirmation);
      setResult(response);
      setConfirmOpen(false);
      onDeleted();
    } catch (deleteError) {
      setConfirmOpen(false);
      if (deleteError instanceof AccountDeletionBlockedError) {
        setBlockedSpaces(deleteError.spaces.map((space) => space.name));
        setError(deleteError.message);
      } else {
        setError(
          deleteError instanceof Error
            ? deleteError.message
            : "Could not request deletion.",
        );
      }
    } finally {
      setWorking(false);
    }
  }

  if (result) {
    return (
      <div className={`${customRowClass} flex flex-col gap-2`}>
        <Text wrap size="control" role="status">
          Deletion requested.
        </Text>
        <Text wrap size="control" tone="muted">
          Your account is scheduled for deletion. It stays recoverable for 30
          days if you sign in again and cancel.
        </Text>
      </div>
    );
  }

  return (
    <div className={`${customRowClass} flex flex-col gap-3`}>
      <Text wrap size="control" tone="muted">
        Deleting your account removes your profile, private files, and space
        memberships after a 30-day recovery window. This cannot be undone once
        the window closes.
      </Text>

      <div className="grid gap-3">
        <Field label="Password">
          <Input
            id="account-delete-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        <Field label={`Type ${CONFIRMATION} to confirm`}>
          <Input
            id="account-delete-confirmation"
            type="text"
            autoComplete="off"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="danger"
          disabled={!ready || working}
          aria-busy={working}
          onClick={() => setConfirmOpen(true)}
        >
          Delete my account
        </Button>
      </div>

      {blockedSpaces.length > 0 ? (
        <ul className="list-disc pl-5 text-control text-cream">
          {blockedSpaces.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      ) : null}

      <FieldError message={error} />

      <ConfirmDeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete your Misty account?"
        what="Your account is scheduled for deletion and stays recoverable for 30 days. After that it is permanently removed."
        confirmLabel="Delete account"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
