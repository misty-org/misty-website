

/** First letter of the first two words, uppercased — for avatar fallbacks. */
export function toInitials(value: string): string {
  return value
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
