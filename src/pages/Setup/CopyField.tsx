import { CopyButton, Surface, Text } from "@misty/ui";

export function CopyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1.5">
      <Text size="control" tone="muted">
        {label}
      </Text>
      <Surface
        tone="card"
        edge="hairline"
        radius="lg"
        className="flex min-w-0 items-center gap-2 py-1 pl-4 pr-1"
      >
        <Text wrap size="meta" className="min-w-0 flex-1 [overflow-wrap:anywhere]">
          {value}
        </Text>
        <CopyButton value={value} label={`Copy ${label.toLowerCase()}`} />
      </Surface>
    </div>
  );
}
