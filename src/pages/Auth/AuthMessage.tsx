import { Text } from "@misty/ui";

interface AuthMessageProps {
  tone: "error" | "success" | "muted";
  message: string;
}

/** What the form has to say: an error in the danger color, anything else in quiet text. */
export default function AuthMessage({ tone, message }: AuthMessageProps) {
  const isError = tone === "error";

  return (
    <Text
      wrap
      size="control"
      tone={isError ? "danger" : tone === "success" ? "default" : "muted"}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      aria-atomic="true"
    >
      {message}
    </Text>
  );
}
