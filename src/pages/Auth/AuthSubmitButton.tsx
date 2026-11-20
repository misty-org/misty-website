import { Button } from "@misty/ui";

interface AuthSubmitButtonProps {
  idleLabel: string;
  loading: boolean;
  disabled?: boolean;
}

/** The form's one call to action. While it works it is just disabled; it never shows loading. */
export default function AuthSubmitButton({
  idleLabel,
  loading,
  disabled,
}: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      disabled={disabled || loading}
      aria-busy={loading}
      className="w-full"
    >
      {idleLabel}
    </Button>
  );
}
