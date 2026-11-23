import { Button } from "@misty/ui";

interface AuthSubmitButtonProps {
  idleLabel: string;
  loading: boolean;
  disabled?: boolean;
}

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
