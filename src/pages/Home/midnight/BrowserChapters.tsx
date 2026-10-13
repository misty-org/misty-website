import { useEffect, useRef } from "react";
import { Puzzle } from "lucide-react";
import { NavLink } from "react-router";
import { Chapter } from "./Chapter";
import { Tile, Tiles } from "./Tiles";
import { useTileActive } from "./useTileActive";

/**
 * The Browser part of the homepage story: the native engine and the basics, then
 * sync (in Chapters.tsx). Agents belong to the Work part, so nothing here mentions them.
 * Engine, extension and import claims follow SELLING-POINTS.md and misty/src-tauri.
 */

/** Misty in a real native window: the system's own title bar, with the web engine built into the OS underneath. */
function NativeWindow() {
  return (
    <img className="mist-native-shot" src="/screenshots/misty-native-window.webp" width={2000} height={1257} loading="lazy"
      alt="Misty running in a native macOS window" />
  );
}

/** An inline outside link inside a tile sentence. */
function Ref({ href, children }: { href: string; children: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="mist-tile-text-link">{children}</a>;
}

/** Misty with a Firefox add-on and a Chrome extension open side by side: one window, both catalogs. */
function KiriCard() {
  return (
    <div className="mist-kiri-crop">
      <img src="/screenshots/misty-kiri-extensions.webp" width={2000} height={1254} loading="lazy"
        alt="Misty showing Dark Reader on Firefox Add-ons above uBlock Origin Lite on the Chrome Web Store" />
    </div>
  );
}

/** The two extension catalogs Misty installs from. */
export function ExtensionStores() {
  return (
    <div className="mist-tile-sheet" aria-hidden="true">
      <header><Puzzle size={16} strokeWidth={1.75} /><i /><small>Extensions</small></header>
      <div><b>Chrome Web Store</b><small>Supported</small></div>
      <div><b>Firefox Add-ons</b><small>Supported</small></div>
    </div>
  );
}

/**
 * A recording of Misty's address bar, cropped to its suggestion list. It plays only while it is on
 * screen, and not at all for visitors who prefer reduced motion, who see its poster instead.
 */
export function AddressBar() {
  const video = useRef<HTMLVideoElement>(null);
  // It stays idle until the rope has reached its panel.
  const active = useTileActive(video);
  useEffect(() => {
    const element = video.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!active) { element.pause(); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) void element.play().catch(() => undefined);
      else element.pause();
    }, { threshold: .35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [active]);
  return (
    <video ref={video} className="mist-search-video" src="/videos/misty-address-search.mp4" poster="/screenshots/misty-address-search-poster.jpg"
      width={960} height={794} muted loop playsInline preload="metadata" aria-label="Misty's address bar searching your spaces, files and the web as you type" />
  );
}

export function EngineChapter() {
  return (
    <Chapter id="engine" title={<>Fast, secure,{" "}<span>and lightweight.</span></>}>
      <Tiles>
        {/* Security fixes from Apple and Microsoft are the diff's "updates" line. */}
        <Tile span={5} label="system" title="Runs on the web engine built into macOS and Windows."><NativeWindow /></Tile>
        <Tile span={7} label="engine" title={<>Run Chrome and Firefox extensions with Kiri, a layer on top of <Ref href="https://webkit.org">WebKit</Ref> and <Ref href="https://developer.microsoft.com/microsoft-edge/webview2">WebView2</Ref> that adds the extension APIs used in <Ref href="https://www.chromium.org">Chromium</Ref> and <Ref href="https://firefox-source-docs.mozilla.org/overview/gecko.html">Gecko</Ref>.<NavLink to="/kiri" className="mist-tile-link">Learn about Kiri →</NavLink></>}><KiriCard /></Tile>
      </Tiles>
    </Chapter>
  );
}
