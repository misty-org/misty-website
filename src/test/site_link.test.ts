import { describe, expect, it } from "vitest";

import { docsPagePath, siteLink } from "@/lib/site";

const site = { protocol: "https:", hostname: "mistysys.com", port: "" };
const docs = { protocol: "https:", hostname: "docs.mistysys.com", port: "" };

describe("links between the site and the docs host", () => {
  it("sends docs links from the site to the docs host", () => {
    expect(siteLink("/docs/models", site)).toEqual({ href: "https://docs.mistysys.com/models" });
    expect(siteLink("/docs", site)).toEqual({ href: "https://docs.mistysys.com/" });
    expect(siteLink("/docs/connect#cloud", site)).toEqual({
      href: "https://docs.mistysys.com/connect#cloud",
    });
    expect(siteLink("/pricing", site)).toEqual({ path: "/pricing" });
  });

  it("keeps docs links on the docs host and sends the rest back to the site", () => {
    expect(siteLink("/docs/self-hosting/cloudflare", docs)).toEqual({
      path: "/self-hosting/cloudflare",
    });
    expect(siteLink("/docs", docs)).toEqual({ path: "/" });
    expect(siteLink("/pricing", docs)).toEqual({ href: "https://mistysys.com/pricing" });
    expect(siteLink("/", docs)).toEqual({ href: "https://mistysys.com/" });
  });

  it("does not mistake a page that only starts with docs for the docs", () => {
    expect(siteLink("/docsearch", site)).toEqual({ path: "/docsearch" });
  });

  it("pairs localhost with docs.localhost in development", () => {
    const local = { protocol: "http:", hostname: "localhost", port: "5173" };
    const localDocs = { ...local, hostname: "docs.localhost" };
    expect(siteLink("/docs/models", local)).toEqual({ href: "http://docs.localhost:5173/models" });
    expect(siteLink("/download", localDocs)).toEqual({ href: "http://localhost:5173/download" });
  });

  it("names a docs-host page as links name it", () => {
    expect(docsPagePath("/models", "docs.mistysys.com")).toBe("/docs/models");
    expect(docsPagePath("/", "docs.mistysys.com")).toBe("/docs");
    expect(docsPagePath("/docs/models", "mistysys.com")).toBe("/docs/models");
  });
});
