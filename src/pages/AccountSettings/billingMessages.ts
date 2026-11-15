import type { BillingRefusalCode } from "./api";

export const failed = "That didn't work. Try again in a few minutes.";

/** What to tell someone when billing refuses a change. */
export const refusalMessages: Record<BillingRefusalCode, string> = {
  payment_needed:
    "Your card didn't go through, so nothing changed. Update your card under Manage, then try again.",
  payment_past_due: "Your last payment failed. Update your card under Manage, then try again.",
  not_subscribed: "That subscription has ended. Start a new one instead.",
  plus_required: "Included Boosts come with Misty+.",
  too_many_boosts: "That's more Boosts than Misty+ includes.",
  move_wait: "You moved Boosts this week. You can move them again after a week.",
  not_a_member: "You can only boost Spaces you're in.",
  other: failed,
};

export function longDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
