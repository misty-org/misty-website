/**
 * The facts every legal document repeats. Keep the placeholders here and
 * nowhere else, so swapping in the real operator (or a future LLC) is a
 * one-line change.
 *
 * TODO(before launch): replace OPERATOR_NAME and GOVERNING_STATE.
 */
export const legalInfo = {
  /** The legal person who runs Misty. A sole proprietor today. */
  operatorName: "[YOUR LEGAL NAME]",
  /** How the operator is described the first time it is named. */
  operatorDescription: "[YOUR LEGAL NAME], an individual doing business as Misty",
  governingState: "[YOUR STATE]",
  supportEmail: "support@mistysys.com",
  privacyEmail: "privacy@mistysys.com",
  siteUrl: "https://mistysys.com",
  lastUpdated: "October 7, 2026",
  minimumAge: 13,
  minimumAgeEeaUk: 16,
} as const;
