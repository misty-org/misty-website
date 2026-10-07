import type { Kind } from "./syncTreeModel";

/**
 * Names for each part of the sync tree, used in its accessible labels. Keep these true to the
 * browser-sync crate in misty: one encrypted vault per account, one workspace tree per device
 * (window → tab → pane → view's page), signed changes, and pages carrying their history.
 */
export const parts: { kind: Kind; name: string }[] = [
  { kind: "vault", name: "Vault" },
  { kind: "device", name: "Device" },
  { kind: "window", name: "Window" },
  { kind: "tab", name: "Tab" },
  { kind: "pane", name: "Pane" },
  { kind: "page", name: "Website" },
];
