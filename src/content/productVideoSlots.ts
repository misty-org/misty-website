export type ProductVideoSlotId =
  | "create-space"
  | "choose-integrations"
  | "choose-apps"
  | "workspace-layouts"
  | "agent-workflows"
  | "share-space";

export type ProductVideoSlot = {
  filename: string;
  src?: string;
  label: string;
  desiredState: string;
};

/**
 * Add each finished recording to `public/videos`, then set its `src` here.
 * Until then, the scroll story renders its existing product preview.
 */
export const productVideoSlots: Record<ProductVideoSlotId, ProductVideoSlot> = {
  "create-space": {
    filename: "misty-create-space.mp4",
    label: "Creating a Misty Space",
    desiredState: "Create and name a Space for one project, then open it.",
  },
  "choose-integrations": {
    filename: "misty-choose-integrations.mp4",
    label: "Choosing integrations inside a Misty app",
    desiredState: "Open an app’s integrations, choose a supported service, and show it open inside Misty. Skip sign-in screens.",
  },
  "choose-apps": {
    filename: "misty-choose-apps.mp4",
    label: "Adding apps to the Misty navigation",
    desiredState:
      "Open the new-app menu and add several apps to the navigation in quick succession.",
  },
  "workspace-layouts": {
    filename: "misty-workspace-layouts.mp4",
    label: "Building and switching between flexible workspace layouts",
    desiredState:
      "Arrange apps into panels, create a virtual window, and switch between the two layouts.",
  },
  "agent-workflows": {
    filename: "misty-agent-workflows.mp4",
    label: "Asking a Misty Agent to manage a workflow",
    desiredState:
      "Add or select an Agent, show its permitted context, and ask for help with a real supported task. Hold on the result.",
  },
  "share-space": {
    filename: "misty-share-space.mp4",
    label: "Sharing a Misty Space with other people",
    desiredState:
      "Invite a collaborator into the Space and show shared work. Keep private website sessions and personal files out of the shared context.",
  },
};
