import AuthShell from "../Auth/AuthShell";

/**
 * Where the desktop app sends the browser once someone signs in to an app's own MCP server (on
 * Misty Cloud). The sign-in code stayed on their computer; this page only says it worked, so the
 * address bar doesn't end on the app's one-time local address.
 */
export default function Connected() {
  return (
    <AuthShell title="You're connected">
      <p className="text-center text-muted-foreground">
        Go back to Misty to use it. You can close this tab.
      </p>
    </AuthShell>
  );
}
