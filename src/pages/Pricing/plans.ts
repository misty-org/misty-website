/**
 * Misty Cloud's plan, in one place. These are the numbers the Cloud server's
 * account limits use; change both together.
 */
export const cloudPlan = {
  price: 10,
  storageGb: 50,
  devices: 5,
  appActionsPerMonth: 1000,
  storageAddOn: { gb: 100, price: 5 },
} as const;

const count = (value: number) => value.toLocaleString("en-US");

export const freeIncludes: string[] = [
  "Every feature, with no limits beyond what your own accounts allow.",
  "You run the server and set up Cloudflare, Composio and Google sign-in yourself.",
  "Without a server, Misty works as a browser and keeps everything on your computer.",
];

export const cloudIncludes: string[] = [
  `${cloudPlan.storageGb} GB of storage for your files, notes and synced data.`,
  `Up to ${cloudPlan.devices} devices on your account.`,
  `${count(cloudPlan.appActionsPerMonth)} app actions each month, such as sending a Slack message or adding a calendar event.`,
];

/** What each limit counts and what happens at it, one sentence each. */
export const pricingDetails: { term: string; detail: string }[] = [
  {
    term: "Storage",
    detail: `Library files, notes, drawings and your encrypted sync data all count. Add ${cloudPlan.storageAddOn.gb} GB at a time for $${cloudPlan.storageAddOn.price} a month each.`,
  },
  {
    term: "Devices",
    detail: "Each computer signed in to your account is one device.",
  },
  {
    term: "App actions",
    detail:
      "They reset each month on the day you subscribed, your billing date. At the limit, agents stop acting in apps until then, and everything else keeps working. Web search runs on your computer with your own search key, so it isn't counted.",
  },
  {
    term: "Your account",
    detail:
      "Paying creates your Misty Cloud account and emails you a setup link, so there's no separate sign-up. Cancelling takes effect at the end of the month you've paid for. After that your account is read-only for 30 days so you can export your data, and then it's deleted.",
  },
];
