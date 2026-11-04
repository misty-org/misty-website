import { describe, expect, it } from "vitest";
import { passwordProblem } from "./accountPassword";

describe("password rules, as in the app", () => {
  it("refuses short passwords and ones missing a required character", () => {
    expect(passwordProblem("short-1")).toMatch(/8 characters/);
    expect(passwordProblem("ALLCAPS123!")).toMatch(/lowercase/);
    expect(passwordProblem("nospecialcharacter")).toMatch(/special/);
    expect(passwordProblem("a-".repeat(37))).toMatch(/72 bytes/);
  });

  it("accepts what meets every rule", () => {
    expect(passwordProblem("lower-only")).toBeNull();
    expect(passwordProblem("Correct horse 9")).toBeNull();
  });
});
