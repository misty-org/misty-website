import type { IntegrationDoc } from "./types";

export const composioEnv: IntegrationDoc = {
  slug: "composio",
  file: "composio.env",
  service: "Composio",
  summary:
    "Connects agents to apps such as Gmail, Slack, GitHub and Google Calendar.",
  purpose: [
    "Agents act in other apps through Composio. Each Misty account maps to one Composio user with a random ID, so Composio never sees anyone's Misty ID or email address. Sign-in to each app uses Composio's own managed OAuth, so you don't register an OAuth app for Gmail, Slack or the rest. A toolkit without a managed scheme needs an auth config in the Composio dashboard before people can connect it.",
    "Every action an agent takes in a connected app, such as sending a message or creating an event, is one Composio tool call.",
  ],
  account: [
    "A Composio account with one project for this server. Composio has a free allowance of tool calls each month and paid plans above it; check its pricing page for the current numbers.",
  ],
  youSet: [
    {
      name: "MISTY_COMPOSIO_API_KEY",
      about:
        "Your Composio project's API key. Every server has connected apps, so it's required.",
      howTo: "Project Settings → API Keys in the Composio dashboard.",
    },
  ],
  steps: [
    "Sign up at [platform.composio.dev](https://platform.composio.dev).",
    "Create a project for your Misty server, or use the default one.",
    "Open the project's Settings → API Keys and create a key. Copy it.",
    "Write it into `~/.misty/server/prod/composio.env` as `MISTY_COMPOSIO_API_KEY`.",
  ],
  example: `MISTY_COMPOSIO_API_KEY=<your project API key>`,
};
