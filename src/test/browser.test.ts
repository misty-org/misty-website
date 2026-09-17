import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isEmbeddedBrowser } from "@/lib/browser";

describe("isEmbeddedBrowser", () => {
  const originalLocation = window.location;
  const originalUserAgent = navigator.userAgent;

  beforeEach(() => {
    // Reset window modifications
    const win = window as unknown as Record<string, unknown>;
    delete win.__MISTY_APP_SHORTCUTS__;
    delete win.__MISTY_SET_SHORTCUTS__;
    delete win.__MISTY_SET_POINTER_TRACKING__;
    delete win.__TAURI__;
    delete win.__TAURI_INTERNALS__;
    delete win.__TAURI_METADATA__;
    delete win.webkit;
    delete win.chrome;
    delete win.Android;
    delete win.AndroidBridge;
    if (typeof process !== "undefined" && process.versions) {
      delete (process.versions as Record<string, string>).electron;
    }
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      writable: true,
      configurable: true,
    });
    if (typeof process !== "undefined" && process.versions) {
      delete (process.versions as Record<string, string>).electron;
    }
  });

  it("returns false in a clean desktop browser environment", () => {
    expect(isEmbeddedBrowser()).toBe(false);
  });

  it("detects Misty desktop app via injected shortcuts bridge", () => {
    const win = window as unknown as Record<string, unknown>;
    win.__MISTY_APP_SHORTCUTS__ = new Map();
    expect(isEmbeddedBrowser()).toBe(true);
  });

  it("detects Misty desktop app via pointer tracking flag", () => {
    const win = window as unknown as Record<string, unknown>;
    win.__MISTY_SET_POINTER_TRACKING__ = () => {};
    expect(isEmbeddedBrowser()).toBe(true);
  });

  it("detects Misty desktop app via WebKit message handlers", () => {
    const win = window as unknown as Record<string, unknown>;
    win.webkit = {
      messageHandlers: {
        mistyFocus: { postMessage: () => {} },
      },
    };
    expect(isEmbeddedBrowser()).toBe(true);
  });

  it("detects Tauri webview environment", () => {
    const win = window as unknown as Record<string, unknown>;
    win.__TAURI__ = {};
    expect(isEmbeddedBrowser()).toBe(true);
  });

  it("detects Windows WebView2 environment", () => {
    const win = window as unknown as Record<string, unknown>;
    win.chrome = { webview: {} };
    expect(isEmbeddedBrowser()).toBe(true);
  });

  it("detects Android WebView bridge", () => {
    const win = window as unknown as Record<string, unknown>;
    win.Android = {};
    expect(isEmbeddedBrowser()).toBe(true);
  });

  it("detects Electron desktop environment via versions.electron", () => {
    (process.versions as Record<string, string>).electron = "32.0.0";
    expect(isEmbeddedBrowser()).toBe(true);
  });

  it("detects iframe embedding", () => {
    const originalTop = window.top;
    try {
      Object.defineProperty(window, "top", {
        value: {},
        writable: true,
        configurable: true,
      });
      expect(isEmbeddedBrowser()).toBe(true);
    } finally {
      Object.defineProperty(window, "top", {
        value: originalTop,
        writable: true,
        configurable: true,
      });
    }
  });

  it("detects explicit query parameter override ?embedded=1", () => {
    Object.defineProperty(window, "location", {
      value: new URL("https://mistysys.com/?embedded=1"),
      writable: true,
      configurable: true,
    });
    expect(isEmbeddedBrowser()).toBe(true);
  });

  it("detects explicit query parameter override ?embedded=true", () => {
    Object.defineProperty(window, "location", {
      value: new URL("https://mistysys.com/?embedded=true"),
      writable: true,
      configurable: true,
    });
    expect(isEmbeddedBrowser()).toBe(true);
  });

  it("detects Android WebView via user agent", () => {
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.144 Mobile Safari/537.36",
      writable: true,
      configurable: true,
    });
    expect(isEmbeddedBrowser()).toBe(true);
  });

  it("detects iOS in-app webview via user agent", () => {
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
      writable: true,
      configurable: true,
    });
    expect(isEmbeddedBrowser()).toBe(true);
  });

  it("detects Slack/Discord in-app browsers via user agent", () => {
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Discord/0.0.309 Chrome/120.0.6099.291 Electron/28.2.1 Safari/537.36",
      writable: true,
      configurable: true,
    });
    expect(isEmbeddedBrowser()).toBe(true);
  });
});
