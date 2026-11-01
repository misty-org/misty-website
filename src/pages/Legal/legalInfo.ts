import { SUPPORT_EMAIL } from "@/lib/site";

/**
 * The facts every legal document repeats, in one place, so changing the
 * operator (for example to a future LLC) is a one-line change.
 */
export const legalInfo = {
  /** The legal person who runs Misty. A sole proprietor today. */
  operatorName: "Matthew Chen",
  /** How the operator is described the first time it is named. */
  operatorDescription: "Matthew Chen, an individual doing business as Misty",
  governingState: "California",
  /** The one address for help, privacy requests and copyright notices. */
  supportEmail: SUPPORT_EMAIL,
  siteUrl: "https://mistysys.com",
  lastUpdated: "October 31, 2026",
  minimumAge: 13,
  minimumAgeEeaUk: 16,
} as const;
