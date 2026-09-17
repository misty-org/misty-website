/**
 * Detects whether the current page is running inside an embedded browser environment,
 * such as Misty's in-app browser (via macOS WKWebView or Tauri), Windows WebView2, Android WebView,
 * iOS in-app WKWebView, Electron, or an embedded iframe.
 *
 * In embedded environments, native momentum scrolling is handled asynchronously by the host
 * application/compositor. Programmatic scroll hijacking (like continuous window.scrollTo calls
 * on wheel) fights native momentum and causes severe scroll jitter.
 */
export function isEmbeddedBrowser(): boolean {
  if (typeof window === "undefined") return false;

  // 1. Explicit query parameter override (useful for debugging, tests, or embeds: ?embedded=1 or ?embedded=true)
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("embedded") === "1" || params.get("embedded") === "true") {
      return true;
    }
  } catch {
    // Ignore URL parsing errors
  }

  // 2. Misty desktop application webview environment
  const win = window as unknown as Record<string, unknown>;
  if (
    "__MISTY_APP_SHORTCUTS__" in win ||
    "__MISTY_SET_SHORTCUTS__" in win ||
    "__MISTY_SET_POINTER_TRACKING__" in win
  ) {
    return true;
  }

  // 3. Tauri webviews
  if (
    "__TAURI__" in win ||
    "__TAURI_INTERNALS__" in win ||
    "__TAURI_METADATA__" in win
  ) {
    return true;
  }

  // 4. Native WebKit message handlers (Misty on macOS, iOS/macOS host app WKWebView bridges)
  const webkit = win.webkit as { messageHandlers?: Record<string, unknown> } | undefined;
  if (
    webkit?.messageHandlers &&
    typeof webkit.messageHandlers === "object" &&
    Object.keys(webkit.messageHandlers).length > 0
  ) {
    return true;
  }

  // 5. Windows WebView2 (Chromium embedded in Windows desktop apps)
  const chrome = win.chrome as { webview?: unknown } | undefined;
  if (chrome?.webview) {
    return true;
  }

  // 6. Android WebView JavaScript interfaces
  if ("Android" in win || "AndroidBridge" in win) {
    return true;
  }

  // 7. Electron apps
  const proc = win.process as { versions?: { electron?: string } } | undefined;
  if (proc?.versions?.electron) {
    return true;
  }

  // 8. Embedded inside an iframe / parent window
  try {
    if (window.self !== window.top) {
      return true;
    }
  } catch {
    // Cross-origin iframe security error indicates an embedded iframe
    return true;
  }

  // 9. Standalone PWA / WebApp mode
  const nav = window.navigator as unknown as { standalone?: boolean };
  if (nav?.standalone === true) {
    return true;
  }
  try {
    if (window.matchMedia?.("(display-mode: standalone)").matches) {
      return true;
    }
  } catch {
    // Ignore matchMedia errors
  }

  // 10. User-Agent heuristics for in-app browsers & webviews
  const ua = navigator.userAgent || "";
  if (
    /;\s*wv\b/i.test(ua) || // Android WebView identifier
    (/Android/i.test(ua) && /Version\/[0-9.]+/i.test(ua) && /Chrome\/[0-9.]+/i.test(ua) && !/Mobile Safari\/[0-9.]+/i.test(ua)) ||
    (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua)) || // iOS in-app webview
    /Electron|Misty|Tauri/i.test(ua) || // Desktop shells
    /FBAN|FBAV|Instagram|Twitter|Slack|Discord|Line\/|Snapchat|LinkedIn/i.test(ua) // Common in-app webviews
  ) {
    return true;
  }

  return false;
}
