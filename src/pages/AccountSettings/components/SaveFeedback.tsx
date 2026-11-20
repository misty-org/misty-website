import { FieldError, Text } from "@misty/ui";

export function SaveFeedback({ ok, error }: { ok: boolean; error: string }) {
  if (ok) {
    return (
      <Text wrap size="meta" tone="muted" role="status" aria-live="polite" className="mt-2">
        Saved.
      </Text>
    );
  }

  if (error) {
    return <FieldError message={<span role="alert">{error}</span>} className="mt-2" />;
  }

  return null;
}
