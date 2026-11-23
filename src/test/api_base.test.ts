import { describe, expect, it } from "vitest";

import { resolveApiBase } from "../lib/api_base";

describe("resolveApiBase", () => {
  it("uses Misty's API by default", () => {
    expect(resolveApiBase("")).toBe("https://api.mistysys.com/v1");
    expect(resolveApiBase("   ")).toBe("https://api.mistysys.com/v1");
  });

  it("normalizes an explicitly configured API base", () => {
    expect(resolveApiBase("/custom/api/")).toBe("/custom/api");
  });
});
