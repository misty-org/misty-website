const hexColor = /^#[0-9a-f]{6}$/i;

export function avatarOutline(decoration: unknown): string | undefined {
  if (!decoration || typeof decoration !== "object") return undefined;
  const outline = (decoration as { outline?: unknown }).outline;
  return typeof outline === "string" && hexColor.test(outline) ? outline : undefined;
}
