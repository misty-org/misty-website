export function SaveFeedback({ ok, error }: { ok: boolean; error: string }) {
  if (ok) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="mt-2 text-sm text-[var(--settings-success)]"
      >
        Saved.
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="mt-2 text-sm text-destructive">
        {error}
      </p>
    );
  }

  return null;
}
