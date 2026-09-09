# Misty setup recordings

These six clips appear in the animated “A closer look at Misty” path cards.

Record one clip per step using the same example Space, theme, and app window size.
Aim for 10–20 seconds each, with a short pause before the action and on the finished result. No narration is needed; playback is muted and loops. Prefer MP4 (H.264), 30 fps, and a landscape 8:5 crop such as 1600×1000. Keep important controls inside the frame and use demo content rather than personal accounts or messages.

| Filename | What to capture |
| --- | --- |
| `misty-create-space.mp4` | Create and name a Space, then open it. |
| `misty-choose-apps.mp4` | Add a few apps to that Space. |
| `misty-choose-integrations.mp4` | Open an app’s integrations, choose a supported service, and show it inside Misty. Skip login screens. |
| `misty-workspace-layouts.mp4` | Arrange panels, create a virtual window, and switch layouts. |
| `misty-agent-workflows.mp4` | Add or select an Agent, choose its context, and show a supported task and its result. |
| `misty-share-space.mp4` | Invite a friend and show the shared work they can use. Personal website sessions and files should remain private. |

## Adding finished clips

Place the files in this folder, then set each corresponding `src` in `src/content/productVideoSlots.ts`, for example `src: "/videos/misty-create-space.mp4"`. Slots remain on their existing screenshot or illustrative preview until a source is configured. The same slots serve desktop and mobile; active clips play muted, inline, and loop.

The integration step currently uses a general workspace illustration. Its recording should show the actual in-app integration picker.
