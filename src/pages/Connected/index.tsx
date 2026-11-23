import AuthShell from "../Auth/AuthShell";

export default function Connected() {
  return (
    <AuthShell title="You're connected">
      <p className="text-center text-muted-foreground">
        Go back to Misty to use it. You can close this tab.
      </p>
    </AuthShell>
  );
}
